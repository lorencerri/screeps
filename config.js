const Config = {
    harvester: {
        max: 6,
        parts: {
            base: [WORK, MOVE],
            add: [WORK],
        },
    },
    upgrader: {
        max: 2,
        parts: {
            base: [WORK, CARRY, MOVE],
        },
    },
    builder: {
        max: 2,
        parts: {
            base: [WORK, CARRY, MOVE],
        },
    },
    courier: {
        max: 0,
        parts: {
            base: [CARRY, MOVE],
            add: [CARRY],
        },
    },
};

module.exports = Config;
