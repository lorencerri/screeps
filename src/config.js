// TODO: Remove the need for a config

const Config = {
	harvester: {
		priority: 100,
		max: 6,
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
			add: [WORK, WORK, CARRY]
		}
	},
	builder: {
		max: 3,
		parts: {
			base: [WORK, CARRY, MOVE],
			add: [WORK, CARRY, CARRY, MOVE]
		}
	},
	courier: {
		max: 7,
		priority: 10,
		parts: {
			base: [MOVE, CARRY, CARRY, CARRY],
			add: [CARRY]
		}
	}
};

module.exports = Config;
