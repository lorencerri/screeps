const Config = {
	harvester: {
		priority: 100,
		max: 8,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [WORK]
		}
	},
	upgrader: {
		priority: 5,
		max: 2,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [CARRY]
		}
	},
	builder: {
		max: 4,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [WORK, CARRY]
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
