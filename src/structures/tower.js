// TODO: Rewrite tower file

const Tower = {
	run: function (tower) {
		// Find closest hostile creep
		const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

		// If found, attack
		if (closestHostile) {
			return tower.attack(closestHostile);
		}

		// Find closest damaged structure
		const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
		});

		const closestDamagedWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (s) => s.hits < s.hitsMax && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits <= 5000
		});

		// If found, repair
		if (closestDamagedStructure) {
			tower.repair(closestDamagedStructure);
		} else if (closestDamagedWall) {
			tower.repair(closestDamagedWall);
		}
	}
};

module.exports = Tower;
