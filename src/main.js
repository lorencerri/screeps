// TODO: Rewrite this file, move spawning logic to a logic folder

const _ = require('lodash');
const Config = require('config');
const Harvester = require('./roles/harvester');
const Upgrader = require('./roles/upgrader');
const Builder = require('./roles/builder');
const Courier = require('./roles/courier');
const Tower = require('./structures/tower');

// Prototypes
require('./prototypes/Creep');
require('./prototypes/StructureContainer');

// TODO: Use BODYPART_COST
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
	// Delete old creeps from memory
	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) delete Memory.creeps[name];
	}

	const cpuUsage = [];

	const spawn = Game.spawns['Spawn1'];

	const extensions = spawn.room.find(FIND_STRUCTURES, {
		filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
	});

	// use energyCapacityAvailable
	const shouldWithdrawSpawner =
		(extensions.length === 0 && spawn.getFreeCapacity === 0) ||
		(extensions.every((structure) => structure.store.getFreeCapacity(RESOURCE_ENERGY) === 0) && spawn.store.getFreeCapacity(RESOURCE_ENERGY) === 0);

	// Replenish creeps when they die
	const prioritized = Object.keys(Config).sort((a, b) => (Config[b].priority || 0) - (Config[a].priority || 0));

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

			if (Object.keys(Game.creeps).length === 0) remainingEnergyCapacity = 300;
			if (type === 'harvester' && remainingEnergyCapacity > 500) remainingEnergyCapacity = 500;

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
	const cpuUsageBreakdown = {};
	for (const name in Game.creeps) {
		const creep = Game.creeps[name];
		if (!cpuUsageBreakdown[`${creep.memory.role}s`]) cpuUsageBreakdown[`${creep.memory.role}s`] = 0;
		let startCpu = Game.cpu.getUsed();

		// Run script based on role
		if (creep.memory.role === 'harvester') {
			Harvester.run(creep);
		} else if (creep.memory.role === 'courier') {
			Courier.run(creep);
		} else if (creep.memory.role === 'builder') {
			Builder.run(creep, { shouldWithdrawSpawner });
		} else if (creep.memory.role === 'upgrader') {
			Upgrader.run(creep, { shouldWithdrawSpawner });
		}

		cpuUsageBreakdown[`${creep.memory.role}s`] += Game.cpu.getUsed() - startCpu;
	}

	// Iterate through all structures
	for (const name in Game.structures) {
		const structure = Game.structures[name];

		if (structure.structureType === STRUCTURE_TOWER) {
			Tower.run(structure);
		}
	}

	console.log('=== CPU USAGE SUMMARY ===');
	console.log(
		Object.keys(cpuUsageBreakdown)
			.map((c) => `[${c}]: ${cpuUsageBreakdown[c].toFixed(3)}`)
			.join('\n')
	);
	const totalCpu = Game.cpu.getUsed();
	console.log(`Other: ${(totalCpu - Object.values(cpuUsageBreakdown).reduce((a, b) => a + b, 0)).toFixed(3)}`);
	console.log(`Total: ${totalCpu.toFixed(3)}`);

	/*// Search market buy orders for energy
    const orders = Game.market.getAllOrders({
        type: ORDER_BUY,
        resourceType: RESOURCE_ENERGY,
    });

    // Get best order based on price per unit
    const bestOrder = _.max(orders, (order) => order.price);*/

	// If your excess CPU bucket is full, use 10000 CPU to generate a pixel
	if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel();
};
