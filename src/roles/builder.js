const { getOppositeDirection } = require('helpers');

const visualizePathStyle = { stroke: '#ffffff' };

const Builder = {
	run: function (creep, options) {
		// Handle building state
		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false;
		}
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			creep.memory.building = true;
		}

		// Handle building
		if (creep.memory.building) {
			const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
			if (target) {
				const build = creep.build(target);
				if (build == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {
						visualizePathStyle
					});
				}
			} else {
				// Start repairing when idling
				// Find closest damaged structure
				const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (s) => structure.hits < structure.hitsMax
				});

				// If found, repair
				if (closestDamagedStructure) {
					const repair = tower.repair(closestDamagedStructure);
					if (repair == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {
							visualizePathStyle
						});
					}
				}
			}
		} else {
			// Handle energy pickup
			const spawn = Game.spawns['Spawn1'];

			// Only pick up energy if spawn is full
			if (!options.shouldWithdrawSpawner) {
				// Don't wait adjacent to spawner in an effort to not block other creeps
				if (creep.pos.getRangeTo(spawn) > 2) return creep.moveTo(spawn, { visualizePathStyle });
				else if (creep.pos.getRangeTo(spawn) === 1) return creep.move(getOppositeDirection(creep.pos.getDirectionTo(spawn)));
				else return;
			}

			const withdraw = creep.withdraw(spawn, RESOURCE_ENERGY);

			// If out of range, move towards spawn
			if (withdraw == ERR_NOT_IN_RANGE) {
				creep.moveTo(spawn, { visualizePathStyle });
			}
		}
	}
};

module.exports = Builder;
