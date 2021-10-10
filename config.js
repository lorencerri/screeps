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
		max: 6,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [CARRY, MOVE, CARRY, WORK]
		}
	},
	builder: {
		max: 4,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [WORK, CARRY, CARRY]
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
