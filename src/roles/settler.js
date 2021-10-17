const Settler = {
	run: function (creep) {
		const room = 'E46S53';
		console.log('Claiming');

		// If hurt, heal
		if (creep.hits < creep.hitsMax) {
			const closestEnemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			// But only if out of range of enemy
			if (creep.pos.getRangeTo(closestEnemy) > 6) creep.heal(creep);
		}

		const location = creep.moveTo(new RoomPosition(25, 25, room));
		creep.say(location);
	}
};

module.exports = Settler;
