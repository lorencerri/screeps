const Courier = {
	run: function (creep) {
		creep.generalTasks();

		// Modifier: Only one courier should be assigned to fill extensions
		const couriers = Object.values(Game.creeps).filter((c) => c.memory.role === 'courier');
		const extensionRefillerExists = couriers.find((c) => c.memory.canRefillExtensions);
		if (!extensionRefillerExists) {
			console.log(`[${creep.name}] Assigned to refill extensions`);
			creep.memory.canRefillExtensions = true;
		}

		// Modifier: Pick up dropped energy
		const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
		if (creep.pos.inRangeTo(droppedEnergy)) {
			console.log(`[${creep.name}] In range of dropped energy, attempting to pickup.`);
			creep.pickup(droppedEnergy);
		}

		if (creep.memory.hauling) {
			// Find the nearest depositable container
			const structure = creep.getClosestDepositStructure();

			// If applicable, refill courier
			if (creep.store.getFreeCapacity() > 0) {
				// Find the nearest withdrawable container
				const withdrawStructure = creep.getClosestWithdrawStructure();
				if (
					creep.pos.getRangeTo(withdrawStructure) < creep.pos.getRangeTo(structure) &&
					creep.store.getFreeCapacity() / creep.store.getCapacity() > 0.5
				) {
					console.log(`[${creep.name}] Close withdraw station found, refilling instead`);
					creep.memory.hauling = false;
					return this.run(creep);
				}
			}

			// If no structure found, return
			if (!structure) {
				creep.memory.idle = true;
				return console.log(`[${creep.name}] [Deposit] No structure found`);
			} else creep.memory.idle = false;

			// If not near, move to structure
			if (!creep.pos.isNearTo(structure)) return creep.moveTo(structure);

			// Deposit into structure
			creep.transfer(structure, RESOURCE_ENERGY);

			// If empty, toggle hauling flag
			if (creep.store.getUsedCapacity() === 0) creep.toggle('hauling');
		} else {
			// If has materials, toggle hauling flag
			if (creep.store.getFreeCapacity() === 0) creep.toggle('hauling');

			// Find the nearest withdrawable container
			const structure = creep.getClosestWithdrawStructure();

			// If no structure found, return
			if (!structure) {
				creep.memory.idle = true;
				return console.log(`[${creep.name}] [Withdraw] No structure found`);
			} else creep.memory.idle = false;

			// If not near, move to structure
			if (!creep.pos.isNearTo(structure)) return creep.moveTo(structure);

			// Withdraw from structure
			creep.withdraw(structure, RESOURCE_ENERGY);
		}
	}
};

module.exports = Courier;
