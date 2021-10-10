const _ = require('lodash');
const Config = require('config');
const Harvester = require('role.harvester');
const Upgrader = require('role.upgrader');
const Builder = require('role.builder');
const Courier = require('role.courier');

const typesToEnergy = {
	WORK: 100,
	CARRY: 50,
	MOVE: 50,
	ATTACK: 80,
	RANGED_ATTACK: 150,
	HEAL: 250,
	CLAIM: 600,
	TOUGH: 10
};

module.exports.loop = function () {
	const spawn = Game.spawns['Spawn1'];

	const extensions = spawn.room.find(FIND_STRUCTURES, {
		filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
	});

	// use energyCapacityAvailable
	const shouldWithdrawSpawner =
		(extensions.length === 0 && spawn.getFreeCapacity === 0) ||
		(extensions.every((structure) => structure.store.getFreeCapacity(RESOURCE_ENERGY) === 0) && spawn.store.getFreeCapacity(RESOURCE_ENERGY) === 0);

	// Replenish creeps when they die
	const prioritized = Object.keys(Config).sort((a, b) => Config[b].priority || 0 - Config[a].priority || 0);
	for (let i = 0; i < prioritized.length; i++) {
		const type = prioritized[i];
		const role = Config[type];

		// Get creep count of this type
		const count = _.filter(Game.creeps, (creep) => creep.memory.role === type).length;

		// Determine if more should be spawned
		if (count < role.max) {
			// Determine parts of the creep
			const parts = [...role.parts.base];

			// Determine energy capacity
			let remainingEnergyCapacity = extensions.length * 50 + 300;

			for (let x = 0; x < role.parts.base.length; x++) {
				remainingEnergyCapacity -= typesToEnergy[role.parts.base[x].toUpperCase()];
			}

			if (remainingEnergyCapacity < 0) {
				console.log('Not enough energy for the base parts!');
			}

			if (role.parts.add) {
				let iters = 0; // just in case, infinite loop protection
				while (remainingEnergyCapacity > 0 && iters <= 50) {
					for (let x = 0; x < role.parts.add.length; x++) {
						const part = role.parts.add[x];
						remainingEnergyCapacity -= typesToEnergy[part.toUpperCase()];
						if (remainingEnergyCapacity >= 0) parts.push(part);
						else break;
					}
					iters++;
				}
			}

			// Spawn creep
			console.log(`[Spawning] ${type} -> ${parts.join(', ')}`);
			const spawned = spawn.spawnCreep(parts, `${type}_${Game.time}`, {
				memory: {
					role: type
				}
			});

			if (spawned !== OK) {
				console.log(`[Spawning] ${type} failed: ${spawned}`);
			}

			// If there isn't enough energy, don't try to produce other types of creeps
			if (spawned === ERR_NOT_ENOUGH_ENERGY || spawned === OK || spawned === ERR_BUSY) {
				break;
			}
		}
	}

	// Iterate through all creeps
	for (const name in Game.creeps) {
		const creep = Game.creeps[name];

		// Run script based on role
		if (creep.memory.role === 'harvester') {
			Harvester.run(creep);
		} else if (creep.memory.role === 'builder') {
			Builder.run(creep, { shouldWithdrawSpawner });
		} else if (creep.memory.role === 'upgrader') {
			Upgrader.run(creep, { shouldWithdrawSpawner });
		} else if (creep.memory.role === 'courier') {
			Courier.run(creep);
		}
	}

	/*// Search market buy orders for energy
    const orders = Game.market.getAllOrders({
        type: ORDER_BUY,
        resourceType: RESOURCE_ENERGY,
    });

    // Get best order based on price per unit
    const bestOrder = _.max(orders, (order) => order.price);*/

	// If your excess CPU bucket is full, use 10000 CPU to generate a pixel
	console.log(`[Ext] Your bucket currently has ${Game.cpu.bucket}/10000 excess CPU required to generate a pixel.`);
	if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel();
};
