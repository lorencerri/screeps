const Upgrader = {
	run: function (creep) {
		const generalTasks = creep.generalTasks();
		if (generalTasks) return;

		// Find the room's controller
		const controller = creep.room.controller;

		// if (creep.signController(controller, 'Just your friendly neighborhood trading outpost') === ERR_NOT_IN_RANGE) {
		// 	 return creep.moveTo(controller);
		// } else return;

		if (creep.memory.upgrading) {
			// Attempt to upgrade controller
			const upgradeResponse = creep.upgradeController(controller);

			// If not in range, move to controler
			if (upgradeResponse === ERR_NOT_IN_RANGE) creep.moveTo(controller);

			// If empty, toggle upgrading flag
			if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) creep.toggle('upgrading');
		} else {
			// If full, toggle the upgrading flag
			if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) creep.toggle('upgrading');

			// Check if there's a link next to the controller
			const link = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => s.structureType === STRUCTURE_LINK && s.pos.getRangeTo(controller) <= 3 && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
			});

			// Check if there's a container next to the controller
			const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.pos.getRangeTo(controller) <= 3
			});

			if (link || container) {
				// If not near, move to container
				if (!creep.pos.isNearTo(link || container)) return creep.moveTo(link || container);

				// If near, withdraw
				const withdrawResponse = creep.withdraw(link || container, RESOURCE_ENERGY);

				// Toggle upgrading flag
				if (withdrawResponse === OK) creep.toggle('upgrading');
			} else {
				// Find the nearest withdrawable container
				const structure = creep.getClosestWithdrawStructure();

				// If no structure found, return
				if (!structure) {
					creep.memory.idle = true;
					return console.log(`[${creep.name}] No structure found`);
				} else creep.memory.idle = false;

				// If not near, move to structure
				if (!creep.pos.isNearTo(structure)) return creep.moveTo(structure);

				// If near, withdraw
				creep.withdraw(structure, RESOURCE_ENERGY);
			}
		}
	}
};

module.exports = Upgrader;
