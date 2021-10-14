/***
 * Assigns a valid source to the creep
 */
Creep.prototype.assignSource = function () {
	// Find the closest source that doesn't have three miners assigned to it
	const roomCreeps = this.room.find(FIND_MY_CREEPS);
	const filter = (s) => roomCreeps.filter((c) => c.memory.source === s.id).length < 3;
	const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE, { filter });
	if (!source) return console.log(`[${this.name}] Unable to assign source, none found.`);
	this.memory.source = source.id;
	console.log(`[${this.name}] Assigned source ${source.id}`);
};

/***
 * Moves towards the target, with default options
 */
Creep.prototype._moveTo = Creep.prototype.moveTo;
Creep.prototype.moveTo = function (target, opts = {}) {
	this.memory.targetId = target.id;
	return this._moveTo(target, { reusePath: 25, visualizePathStyle: opts.visualizePathStyle || { stroke: this.getRoleColor() } });
};

/***
 * Returns the color of the creep's role
 */
Creep.prototype.getRoleColor = function () {
	switch (this.memory.role) {
		case 'harvester':
			return '#964B00';
		case 'courier':
			return '#FFFF00';
		case 'builder':
			return '#0000FF';
		case 'upgrader':
			return '#7CFC00';
		default:
			return '#ffffff';
	}
};

/***
 * Returns the closest withdrawable structure
 *
 * Requirements:
 * - The closest non-empty structure should be used
 * - If there are available containers, spawners should not be used
 * - The container in close proximity to the controller should not be used
 *
 * v2.0 Requirements:
 * - Creeps should only be able to withdraw from a container if there's enough inside for everyone going towards it to fill up completely
 *
 * - Add containerId to creep's memory
 */
Creep.prototype.getClosestWithdrawStructure = function (resourceType = RESOURCE_ENERGY) {
	const priority = this.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => {
			if (s.structureType !== STRUCTURE_CONTAINER) return false;
			if (s.store.getUsedCapacity(resourceType) === 0) return false;
			if (s.getType() !== 'WITHDRAW') return false;

			// Get all creeps going towards this container
			const creeps = Object.values(Game.creeps).filter((c) => c.memory.targetId === s.id);

			// Get remaining resources in the container
			const remainingResources = s.store.getUsedCapacity(resourceType);
			let going = 0;

			// Iterate through creeps
			for (const creep of creeps) {
				if (creep.id === this.id) continue; // Skip self
				going += creep.store.getFreeCapacity(resourceType);
			}

			if (going >= remainingResources) return false;
			return true;
		}
	});
	if (priority) return priority;

	const secondary = this.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) =>
			s.structureType === STRUCTURE_SPAWN && !global.attemptingToSpawn && s.store.getUsedCapacity(resourceType) > 0 && this.memory.role !== 'courier'
	});
	return secondary;
};

/***
 * Withdraws, but makes sure it can't deposit back to the same place
 */
Creep.prototype._withdraw = Creep.prototype.withdraw;
Creep.prototype.withdraw = function (target, opts = {}) {
	const withdraw = this._withdraw(target, opts);
	if (withdraw === OK) this.memory.lastWithdrawId = target.id;
	return withdraw;
};

/***
 * Returns the closest depositable structure
 *
 * Requirements:
 * - Faraway (r>3) containers should not be used if there are no couriers
 * - The closest non-full structure should be used
 */
Creep.prototype.getClosestDepositStructure = function (resourceType = RESOURCE_ENERGY) {
	return (
		// Priority 1: Spawns, extensions, containers, towers
		this.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (s) =>
				// TODO: The 'if courier exists' part should encapsulate the entire structure types list.
				// TODO: This should really be rewritten into a function instead of a bunch of operators
				(s.structureType === STRUCTURE_SPAWN || // It can be a spawn
					(this.memory.role === 'courier' && this.memory.canRefillTowers && s.structureType === STRUCTURE_TOWER) ||
					(this.memory.role === 'courier'
						? s.structureType === STRUCTURE_EXTENSION && this.memory.canRefillExtensions
						: s.structureType === STRUCTURE_EXTENSION) || // It can be an extension
					(this.memory.role === 'harvester' // If it's a harvester, add the following conditions for containers
						? (Object.values(Game.creeps).find((c) => c.memory.role === 'courier') && // If there's a courier on the map...
								s.structureType === STRUCTURE_CONTAINER && // It can be a container
								(this.memory.lastWithdrawId ? this.memory.lastWithdrawId !== s.id : true) &&
								s.getType() === 'DEPOSIT') ||
						  s.structureType === STRUCTURE_CONTAINER
						: s.structureType === STRUCTURE_CONTAINER && s.getType() === 'DEPOSIT')) && // Otherwise, it can be a container
				s.store.getFreeCapacity(resourceType) > 0 // It has to have free capacity
		})
	);
};

/***
 * Toggles a specified flag in the creep's internal memory
 * @param {string} flag The flag to toggle
 */
Creep.prototype.toggle = function (flag) {
	if (!flag) return console.log(`[${this.name}][.toggle()] No flag was specified.`);
	if (this.memory[flag]) {
		console.log(`[${this.name}] ${flag} has been toggled to FALSE`);
		this.memory[flag] = false;
	} else {
		console.log(`[${this.name}] ${flag} has been toggled to TRUE`);
		this.memory[flag] = true;
	}
};

/***
 * General logic tasks for creeps at the beginning of each tick
 *
 */
Creep.prototype.generalTasks = function () {
	// If a creep is idling, make them move 3 tiles away from any structure
	// TODO: This should only run if they moved last tick
	if (this.memory.idle) {
		// Find closest structure
		const structure = this.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (s) => s.pos !== this.pos && [STRUCTURE_CONTROLLER, STRUCTURE_SPAWN, STRUCTURE_CONTAINER].includes(s.structureType)
		});

		// If there's no nearby structure, return
		if (!structure) return;

		const range = this.pos.getRangeTo(structure);
		if (range > 1) return;

		console.log(`[${this.name}] Idle and too close to ${structure} (${this.pos.getRangeTo(structure)} tiles), moving...`);

		if (range === 0) {
			const spawn = this.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => s.structureType === STRUCTURE_SPAWN
			});
			return this.moveTo(spawn);
		}

		// Determine cardinal direction to structure
		const direction = this.pos.getDirectionTo(structure);

		// Determine & move to the direct opposite direction
		const opposite = this.getOppositeDirection(direction);
		return this.move(opposite);
	}

	// Modifier: Pick up dropped energy
	const droppedEnergy = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
	if (droppedEnergy && this.pos.inRangeTo(droppedEnergy, 1) && this.store.getFreeCapacity()) {
		console.log(`[${this.name}] In range of dropped energy, attempting to pickup.`);
		return this.pickup(droppedEnergy);
	}

	// Modifier: Extract from tombstone
	const tombstone = this.pos.findClosestByPath(FIND_TOMBSTONES);
	if (tombstone && this.pos.inRangeTo(tombstone, 1) && this.store.getFreeCapacity() > 0 && tombstone.store.getUsedCapacity() > 0) {
		console.log(`[${this.name}] In range of tombstone, attempting to withdraw.`);
		return this.withdraw(tombstone, RESOURCE_ENERGY);
	}
};

/***
 * Returns closest repairable structure
 *
 */
Creep.prototype.getClosestRepairStructure = function () {
	// Find structures that need repair
	const structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => ![STRUCTURE_WALL, STRUCTURE_ROAD].includes(s.structureType) && s.hits < s.hitsMax
	});

	// If a structure is found, return it
	if (structure) return structure;

	// Otherwise, find a wall or road that needs repair
	const externalStructure = this.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => {
			if (![STRUCTURE_WALL, STRUCTURE_ROAD].includes(s.structureType)) return;
			let hitsMax = s.hitsMax;
			if (s.hitsMax > 20000) hitsMax = 20000;
			return s.hits < hitsMax;
		}
	});

	// Return response
	return externalStructure;
};

/***
 * Returns the opposite cardinal direction
 */
Creep.prototype.getOppositeDirection = function (d) {
	return { 1: 5, 2: 6, 3: 7, 4: 8, 5: 1, 6: 2, 7: 3, 8: 4 }[d];
};
