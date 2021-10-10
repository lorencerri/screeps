const visualizePathStyle = { stroke: '#ffffff' };

const Harvester = {
	run: function (creep) {
		// If creep's inventory is empty, start harvesting
		if (creep.store.getFreeCapacity() > 0) {
			// Find closest source
			const source = creep.pos.findClosestByPath(FIND_SOURCES);

			// Attempt to harvest source
			const harvest = creep.harvest(source);

			// If out of range, move towards source
			if (harvest === ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {
					visualizePathStyle
				});
			}
			creep.say(harvest);
		} else {
			const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
			});

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

			// Prioritize container over targets
			const target = container || targets[0];

			// If target is available, transfer energy
			if (target) {
				const transfer = creep.transfer(target, RESOURCE_ENERGY);

				// If out of range, move towards spawn
				if (transfer === ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {
						visualizePathStyle
					});
				}

				creep.say(transfer);
			} else {
				creep.say(ERR_FULL);
			}
		}
	}
};

module.exports = Harvester;
