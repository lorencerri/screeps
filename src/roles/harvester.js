const Harvester = {
	run: function (creep) {
		creep.generalTasks();

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
			if (!creep.pos.isNearTo(source)) return creep.moveTo(source);

			// If near, harvest
			const harvestCode = creep.harvest(source);

			// If harvest is not OK, display code
			if (harvestCode !== OK) creep.say(harvestCode);

			// If full, toggle depositing flag
			if (creep.store.getFreeCapacity() === 0) creep.toggle('depositing');
		} else {
			// If empty, toggle depositing flag
			if (creep.store.getUsedCapacity() === 0) return creep.toggle('depositing');

			// Get the closest depositable structure
			const structure = creep.getClosestDepositStructure();

			// If no structure found, return
			if (!structure) return console.log(`[${creep.name}] No structure found`);

			// If not near, move to structure
			if (!creep.pos.isNearTo(structure)) return creep.moveTo(structure);

			// If near, deposit energy
			const transferCode = creep.transfer(structure, RESOURCE_ENERGY);

			// If transfer is not OK, display code
			if (transferCode !== OK) creep.say(transferCode);
		}
	}
};

module.exports = Harvester;
