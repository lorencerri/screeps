const { getOppositeDirection } = require('helpers');
const visualizePathStyle = { stroke: '#ffffff' };

const Upgrader = {
	run: function (creep, options) {
		// Handle upgrading state
		if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.upgrading = false;
		}
		if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
			creep.memory.upgrading = true;
		}

		// Handle upgrading
		if (creep.memory.upgrading) {
			const controller = creep.room.controller;
			const upgrade = creep.upgradeController(controller);

			// If out of range, move towards controller
			if (upgrade == ERR_NOT_IN_RANGE) {
				creep.moveTo(controller, { visualizePathStyle });
			}
		} else {
			const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.pos.inRangeTo(creep.room.controller, 3)
			});

			if (container) {
				const withdraw = creep.withdraw(container, RESOURCE_ENERGY);

				// If out of range, move towards spawn
				if (withdraw == ERR_NOT_IN_RANGE) {
					creep.moveTo(container, { visualizePathStyle });
				}
			} else {
				const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);

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
	}
};

module.exports = Upgrader;
