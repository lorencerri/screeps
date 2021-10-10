const _ = require('lodash');
const Config = require('config');
const Harvester = require('role.harvester');
const Upgrader = require('role.upgrader');
const Builder = require('role.builder');

module.exports.loop = function () {
	const spawn = Game.spawns['Spawn1'];

	const extensions = spawn.room.find(FIND_STRUCTURES, {
		filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
	});
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

			// Add parts by amount of extensions
			if (role.parts.add) {
				const maxParts = extensions.length + (3 - role.parts.base.length);
				for (let x = 0; x < maxParts; x++) parts.push(...role.parts.add);
			}

			// Spawn creep
			console.log(`[Spawning] ${type}`);
			const spawned = spawn.spawnCreep(parts, `${type}_${Game.time}`, {
				memory: {
					role: type
				}
			});

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
