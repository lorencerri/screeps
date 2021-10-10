const Config = {
	harvester: {
		priority: 100,
		max: 7,
		parts: {
			base: [WORK, WORK, MOVE, CARRY],
			add: WORK
			/* TODO: A [WORK, CARRY] combo should add that instead of a single part */
		}
	},
	upgrader: {
		priority: 5,
		max: 2,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: CARRY
		}
	},
	builder: {
		max: 2,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: CARRY
		}
	},
	courier: {
		max: 2,
		parts: {
			base: [CARRY, MOVE, CARRY, CARRY],
			add: CARRY
		}
	}
};

module.exports = Config;
