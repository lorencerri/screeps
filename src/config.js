const Config = {
	harvester: {
		priority: 100,
		max: 6,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [WORK, CARRY]
		}
	},
	upgrader: {
		priority: 5,
		max: 3,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [WORK, WORK, CARRY]
		}
	},
	builder: {
		max: 3,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [WORK, CARRY, CARRY]
		}
	},
	courier: {
		max: 6,
		priority: 10,
		parts: {
			base: [MOVE, CARRY, CARRY, CARRY],
			add: [CARRY]
		}
	}
};

module.exports = Config;
