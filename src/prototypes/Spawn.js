Spawn.prototype.spawnOnDemand = function () {
	// If currently spawning, return
	if (this.spawning) return;

	// Get extensions
	const extensions = this.room.find(FIND_MY_STRUCTURES, {
		filter: (s) => s.structureType === STRUCTURE_EXTENSION
	});

	// Iterate through roles
	const roles = this.getBaseRoles();
	for (let i = 0; i < roles.length; i++) {
		const role = roles[i];

		// Search for existing creeps of the same role
		const existingCreeps = this.room.find(FIND_MY_CREEPS, {
			filter: (c) => c.memory.role === role.name
		});

		// Check if there are more that should be spawned
		if (existingCreeps.length < role.maxCreeps) {
			const parts = role.base;

			// Determine whether or not to add additional parts
			if ((role.name === 'builder' || existingCreeps.length !== 0) && role.add) {
				// Determine energy pool amount to use for spawning
				let energyPool = Math.min(role.maxEnergy, extensions.length * 50 + 300);

				// Subtract base parts from the energy pool
				energyPool -= parts.reduce((a, b) => a + BODYPART_COST[b], 0);

				// Iterate through additional parts, subtracting from energy pool each time
				while (energyPool > 0) {
					for (let x = 0; x < role.add.length; x++) {
						const part = role.add[x];
						energyPool -= BODYPART_COST[part];
						if (energyPool >= 0) parts.push(part);
						else break;
					}
				}
			}

			// TODO: Return if there is not enough energy to spawn creep
			const energyRequired = parts.reduce((a, b) => a + BODYPART_COST[b], 0);
			const energyAvailable = this.getEnergyAvailable();

			console.log(`[${this.name}] Spawning ${role.name} with [${parts.join(', ')}] for ${energyRequired} energy`);

			// Spawn creep
			const spawnResponse = this.spawnCreep(parts, `${role.name}_${Game.time}`, {
				memory: {
					role: role.name
				}
			});

			if (spawnResponse !== OK) console.log(`[${this.name}] Returned with code ${spawnResponse}`);
			return spawnResponse;
		}
	}
};

Spawn.prototype.getEnergyAvailable = function (extensions) {
	// Base energy (from spawn)
	let energyAvailable = this.store.getUsedCapacity(RESOURCE_ENERGY);

	// Extensions
	if (!extensions) {
		extensions = this.room.find(FIND_MY_STRUCTURES, {
			filter: (s) => s.structureType === STRUCTURE_EXTENSION
		});
	}

	return true;
};

// TODO: Cache this, run whenever deleted from cache (e.g, when a creep dies)
Spawn.prototype.getBaseRoles = function () {
	return [
		{
			name: 'harvester',
			base: [WORK, CARRY, MOVE, WORK],
			add: [WORK],
			maxEnergy: 400,
			maxCreeps: this.room.find(FIND_SOURCES).length * 3
		},
		{
			name: 'courier',
			base: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
			add: [CARRY, CARRY, CARRY, MOVE],
			maxEnergy: 900,
			maxCreeps:
				!this.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER }) &&
				this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'harvester' }).length - 2
		},
		{
			name: 'builder',
			base: [WORK, CARRY, MOVE, WORK],
			add: [CARRY, MOVE, WORK, CARRY, MOVE],
			maxEnergy: 900,
			maxCreeps: this.room.find(FIND_CONSTRUCTION_SITES).length === 0 ? 1 : 3
		},
		{
			name: 'upgrader',
			base: [WORK, CARRY, MOVE, WORK],
			add: [CARRY, WORK, WORK],
			maxEnergy: 900,
			maxCreeps: 4
		}
	];
};
