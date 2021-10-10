const Config = {
	harvester: {
		priority: 100,
		max: 7,
		parts: {
			base: [WORK, MOVE, CARRY],
			add: [WORK]
		}
	},
	upgrader: {
		priority: 5,
		max: 2,
		parts: {
			base: [WORK, CARRY, MOVE]
		}
	},
	builder: {
		max: 2,
		parts: {
			base: [WORK, CARRY, MOVE]
		}
	},
	courier: {
		max: 0,
		parts: {
			base: [CARRY, MOVE],
			add: [CARRY]
		}
	}
};

module.exports = Config;
