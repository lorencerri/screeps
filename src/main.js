// Roles
const Harvester = require('./roles/harvester');
const Upgrader = require('./roles/upgrader');
const Builder = require('./roles/builder');
const Courier = require('./roles/courier');
const Settler = require('./roles/settler');
const Miner = require('./roles/miner');

// Structures
const Tower = require('./structures/tower');
const Link = require('./structures/link');
const Terminal = require('./structures/terminal');

// Prototypes
require('./prototypes/Creep');
require('./prototypes/StructureContainer');
require('./prototypes/Spawn');

module.exports.loop = function () {
	// Clear memory cache
	for (const name in Memory.creeps) {
		if (!Game.creeps[name]) delete Memory.creeps[name];
	}

	// Handle creep spawning
	for (const name in Game.spawns) {
		const spawn = Game.spawns[name];
		spawn.spawnOnDemand();
	}

	// Handle creep actions
	for (const name in Game.creeps) {
		const creep = Game.creeps[name];

		switch (creep.memory.role) {
			case 'harvester':
				Harvester.run(creep);
				break;
			case 'courier':
				Courier.run(creep);
				break;
			case 'builder':
				Builder.run(creep);
				break;
			case 'upgrader':
				Upgrader.run(creep);
				break;
			case 'settler':
				Settler.run(creep);
				break;
			case 'miner':
				Miner.run(creep);
				break;
			default:
				console.log(`[${creep.name}] Unable to run, not assigned to a role`);
				break;
		}
	}

	// Handle structure actions
	for (const name in Game.structures) {
		const structure = Game.structures[name];

		switch (structure.structureType) {
			case STRUCTURE_TOWER:
				Tower.run(structure);
				break;
			case STRUCTURE_LINK:
				Link.run(structure);
				break;
			case STRUCTURE_TERMINAL:
				Terminal.run(structure);
				break;
			default:
				break;
		}
	}

	// Use excess bits to generate a pixel at 10000 CPU
	if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel();
	console.log('=== END OF TICK ===');
};
