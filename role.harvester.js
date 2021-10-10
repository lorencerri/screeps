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
			} else {
				creep.say(harvest);
			}
		} else {
			// TODO: Change this to only target extensions
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
		}
	}
};

module.exports = Harvester;
