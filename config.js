const Config = {
	harvester: {
		priority: 100,
		max: 7,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [WORK]
		}
	},
	upgrader: {
		priority: 5,
		max: 4,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [CARRY, MOVE]
		}
	},
	builder: {
		max: 3,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [WORK, WORK, CARRY]
		}
	},
	courier: {
		max: 2,
		parts: {
			base: [MOVE, CARRY, CARRY, CARRY],
			add: [CARRY]
		}
	}
};

module.exports = Config;
