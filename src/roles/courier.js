const Courier = {
	run: function (creep) {
		creep.generalTasks();

		if (creep.memory.hauling) {
			// Find the nearest depositable container
			const structure = creep.getClosestDepositStructure();

			// If no structure found, return
			if (!structure) {
				creep.memory.idle = true;
				return console.log(`[${creep.name}] No structure found`);
			} else creep.memory.idle = false;

			// If not near, move to structure
			if (!creep.pos.isNearTo(structure)) return creep.moveTo(structure);

			// Deposit into structure
			creep.transfer(structure, RESOURCE_ENERGY);

			// If empty, toggle hauling flag
			if (creep.store.getUsedCapacity() === 0) creep.toggle('hauling');
		} else {
			// If full, toggle hauling flag
			if (creep.store.getFreeCapacity() === 0) creep.toggle('hauling');

			// Find the nearest withdrawable container
			const structure = creep.getClosestWithdrawStructure();

			// If no structure found, return
			if (!structure) {
				creep.memory.idle = true;
				return console.log(`[${creep.name}] No structure found`);
			} else creep.memory.idle = false;

			// If not near, move to structure
			if (!creep.pos.isNearTo(structure)) return creep.moveTo(structure);

			// Withdraw from structure
			creep.withdraw(structure, RESOURCE_ENERGY);
		}
	}
};

module.exports = Courier;
