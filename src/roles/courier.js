const { getOppositeDirection } = require('../helpers');

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
			// Determine closest depleted energy storage
			const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => {
					return (
						(s.structureType === STRUCTURE_EXTENSION ||
							(s.structureType == STRUCTURE_CONTAINER && s.pos.inRangeTo(creep.room.controller, 3)) ||
							s.structureType === STRUCTURE_SPAWN ||
							s.structureType === STRUCTURE_TOWER) &&
						s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
					);
				}
			});
			const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.pos.inRangeTo(creep.room.controller, 3)
			});
			console.log(target);
			// If target is available, transfer energy
			if (target) {
				const transfer = creep.transfer(target, RESOURCE_ENERGY);

				// If out of range, move towards spawn
				if (transfer === ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {
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
				filter: (s) =>
					s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && !s.pos.inRangeTo(creep.room.controller, 3)
			});

			const spawn = Game.spawns['Spawn1'];

			if (container) {
				// If container is found, move to it and withdraw energy
				const withdraw = creep.withdraw(container, RESOURCE_ENERGY);

				// If out of range, move towards container
				if (withdraw == ERR_NOT_IN_RANGE) {
					creep.moveTo(container, {
						visualizePathStyle
					});
				} else {
					if (creep.pos.getRangeTo(spawn) === 1) return creep.move(getOppositeDirection(creep.pos.getDirectionTo(spawn)));
				}
			} else {
				if (creep.pos.getRangeTo(spawn) === 1) return creep.move(getOppositeDirection(creep.pos.getDirectionTo(spawn)));
			}
		}
	}
};

module.exports = Courier;
