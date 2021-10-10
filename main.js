const _ = require("lodash");
const Harvester = require("role.harvester");
const Upgrader = require("role.upgrader");
const Builder = require("role.builder");

const limits = {
    harvester: 4,
    upgrader: 2,
    builder: 2,
};

module.exports.loop = function () {
    const spawn = Game.spawns["Spawn1"];

    const extensionCount = spawn.room.find(STRUCTURE_EXTENSION).length;
    const areAllExtensionsFull =
        spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
                structure.structureType === STRUCTURE_EXTENSION,
        }).length === 0 ||
        spawn.room
            .find(FIND_STRUCTURES, {
                filter: (structure) =>
                    structure.structureType === STRUCTURE_EXTENSION,
            })
            .every(
                (structure) =>
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) === 0
            );
    const isSpawnFull = spawn.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
    const shouldWithdrawSpawner = areAllExtensionsFull && isSpawnFull;

    // Replenish creeps when they die
    for (const limit in limits) {
        const count = _.filter(
            Game.creeps,
            (creep) => creep.memory.role == limit
        ).length;

        const parts = [WORK, CARRY, MOVE];
        for (let i = 0; i < extensionCount; i++) {
            parts.push(WORK);
        }

        if (count < limits[limit]) {
            spawn.spawnCreep(parts, `${limit}_${Game.time}`, {
                memory: {
                    role: limit,
                },
            });
        }
    }

    // Iterate through all creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        // Run script based on role
        if (creep.memory.role === "harvester") {
            Harvester.run(creep);
        } else if (creep.memory.role === "builder") {
            Builder.run(creep, { shouldWithdrawSpawner });
        } else if (creep.memory.role === "upgrader") {
            Upgrader.run(creep, { shouldWithdrawSpawner });
        }
    }

    /*// Search market buy orders for energy
    const orders = Game.market.getAllOrders({
        type: ORDER_BUY,
        resourceType: RESOURCE_ENERGY,
    });

    // Get best order based on price per unit
    const bestOrder = _.max(orders, (order) => order.price);*/
};
