const visualizePathStyle = { stroke: '#ffffff' };

const Courier = {
	run: function (creep, options) {
		// Handle hauling state
		if (creep.memory.hauling && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.hauling = false;
		}
		if (!creep.memory.hauling && creep.store.getFreeCapacity() == 0) {
			creep.memory.hauling = true;
		}

		// Handle hauling
		if (creep.memory.hauling) {
			// Determine which structure to deposit energy
			const targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (
						(structure.structureType === STRUCTURE_EXTENSION ||
							structure.structureType === STRUCTURE_SPAWN ||
							structure.structureType === STRUCTURE_TOWER) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
					);
				}
			});

			// If target is available, transfer energy
			if (targets.length > 0) {
				const transfer = creep.transfer(targets[0], RESOURCE_ENERGY);

				// If out of range, move towards spawn
				if (transfer === ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {
						visualizePathStyle
					});
				} else if (transfer === ERR_FULL) {
					creep.say('Target is full!');
				}
			} else {
				creep.say('Full!');
			}
		} else {
			// Find closest non-empty container
			const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
			});

			if (container) {
				// If container is found, move to it and withdraw energy
				const withdraw = creep.withdraw(container, RESOURCE_ENERGY);

				// If out of range, move towards container
				if (withdraw == ERR_NOT_IN_RANGE) {
					creep.moveTo(container, {
						visualizePathStyle
					});
				}
			}
		}
	}
};

module.exports = Courier;
