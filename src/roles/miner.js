const Miner = {
	run: function (creep) {
		const generalTasks = creep.generalTasks();
		if (generalTasks) return;

		// If no source, run setup methods
		if (!creep.memory.source) {
			creep.assignMineral();
			if (!creep.memory.source) return;
		}

		// If remaining harvest, harvest
		if (!creep.memory.depositing) {
			// Navigate to assigned source
			const source = Game.getObjectById(creep.memory.source);

			// If not near, move to source
			if (!creep.pos.isNearTo(source)) return creep.moveTo(source);

			// If near, harvest
			creep.harvest(source);

			// If full, toggle depositing flag
			if (creep.store.getFreeCapacity() === 0) creep.toggle('depositing');
		} else {
			// If empty, toggle depositing flag
			if (creep.store.getUsedCapacity() === 0) return creep.toggle('depositing');

			// Get the closest terminal structure
			const terminal = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => s.structureType === STRUCTURE_TERMINAL
			});

			// If no structure found, return
			if (!terminal) return console.log(`[${creep.name}] No terminal found`);

			// If not near, move to structure
			if (!creep.pos.isNearTo(terminal)) return creep.moveTo(terminal);

			// If near, deposit all resources
			for (const resourceType in creep.store) {
				creep.transfer(terminal, resourceType);
			}
		}
	}
};

module.exports = Miner;
