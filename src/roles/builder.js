const Builder = {
	run: function (creep) {
		creep.generalTasks();

		if (creep.memory.building) {
			// Find the nearest construction site
			const construction = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

			// If no construction, start repairing
			if (!construction) {
				console.log(`[${creep.name}] No construction found, repairing instead`);

				// Find the nearest repair structure
				const repair = creep.getClosestRepairStructure();

				// If no repair structure, return
				if (!repair) return console.log(`[${creep.name}] No repairable structure found`);

				// If not near, move to repair structure
				if (!creep.pos.isNearTo(repair)) return creep.moveTo(repair);

				// If near, repair
				return creep.repair(repair);
			}

			// If not near, move to construction
			if (!creep.pos.isNearTo(construction)) return creep.moveTo(construction);

			// If near, build
			creep.build(construction);

			// If empty, toggle building flag
			if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) creep.toggle('building');
		} else {
			// If full, toggle building flag
			if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) creep.toggle('building');

			// Find the nearest withdrawable container
			const structure = creep.getClosestWithdrawStructure();

			// If no structure found, return
			if (!structure) return console.log(`[${creep.name}] No structure found`);

			// If not near, move to structure
			if (!creep.pos.isNearTo(structure)) return creep.moveTo(structure);

			// If near, withdraw
			creep.withdraw(structure, RESOURCE_ENERGY);
		}
	}
};

module.exports = Builder;
