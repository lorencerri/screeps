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

			creep.harvest(source);

			if (creep.store.getFreeCapacity() === 0) creep.toggleDepositing();
		} else {
			if (creep.store.getUsedCapacity() === 0) creep.toggleDepositing();

			const structure = creep.getClosestDepositStructure();
			if (!structure) return console.log(`[${creep.name}] No structure found`);

			if (!creep.pos.isNearTo(structure)) creep.moveTo(structure);

			creep.transfer(structure, RESOURCE_ENERGY);
		}
	}
};

module.exports = Harvester;
