const Harvester = {
	run: function (creep) {
		// If no source, run setup methods
		if (!creep.memory.source) {
			creep.assignSource();
			if (!creep.memory.source) return;
		}

		// If remaining harvest, harvest
		if (!creep.memory.depositing) {
			// Navigate to assigned source
			const source = Game.getObjectById(creep.memory.source);

			// If not near, move to source
			if (!creep.pos.isNearTo(source)) creep.moveTo(source);

			// If near, harvest
			creep.harvest(source);

			// If full, toggle depositing flag
			if (creep.store.getFreeCapacity() === 0) creep.toggleDepositing();
		} else {
			// If empty, toggle depositing flag
			if (creep.store.getUsedCapacity() === 0) creep.toggleDepositing();

			// Get the closest depositable structure
			const structure = creep.getClosestDepositStructure();

			// If no structure found, return
			if (!structure) return console.log(`[${creep.name}] No structure found`);

			// If not near, move to structure
			if (!creep.pos.isNearTo(structure)) creep.moveTo(structure);

			// If near, deposit energy
			creep.transfer(structure, RESOURCE_ENERGY);
		}
	}
};

module.exports = Harvester;
