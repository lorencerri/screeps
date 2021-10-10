const visualizePathStyle = { stroke: '#ffffff' };

const Upgrader = {
	run: function (creep, options) {
		// TODO: Fix this creep not moving when the spawn is not empty

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
			// Handle energy pickup
			const spawn = Game.spawns['Spawn1'];

			// Only pick up energy if spawn is full
			if (!options.shouldWithdrawSpawner) return;

			const withdraw = creep.withdraw(spawn, RESOURCE_ENERGY);

			// If out of range, move towards spawn
			if (withdraw == ERR_NOT_IN_RANGE) {
				creep.moveTo(spawn, { visualizePathStyle });
			}
		}
	}
};

module.exports = Upgrader;
