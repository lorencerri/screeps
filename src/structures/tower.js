const Tower = {
	new: function (tower) {
		// Find the closest hostile creep
		const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

		// If there is a hostile creep, attack it
		if (closestHostile) tower.attack(closestHostile);

		// Find the closest damaged structure
		const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
		});

		// If there is a damaged structure, repair it
		if (closestDamagedStructure) return tower.repair(closestDamagedStructure);

		// Find the closest damaged wall
		const closestDamagedWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (s) => s.hits < s.hitsMax && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits <= 20000
		});

		// If there is a damaged wall, repair it
		if (closestDamagedWall) return tower.repair(closestDamagedWall);
	}
};

module.exports = Tower;
