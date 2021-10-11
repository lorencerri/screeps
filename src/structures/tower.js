const Tower = {
	run: function (tower) {
		// Find closest damaged structure
		const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
		});

		const closestDamagedWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (s) => s.hits < s.hitsMax && s.structureType == STRUCTURE_WALL && hits < 1000
		});

		// If found, repair
		if (closestDamagedStructure) {
			tower.repair(closestDamagedStructure);
		} else if (closestDamagedWall) {
			tower.repair(closestDamagedWall);
		}

		// Find closest hostile creep
		const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

		// If found, attack
		if (closestHostile) {
			tower.attack(closestHostile);
		}
	}
};

module.exports = Tower;
