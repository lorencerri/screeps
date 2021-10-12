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
	this._moveTo(target, { visualizePathStyle: opts.visualizePathStyle || { stroke: this.getRoleColor() } });
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

			console.log('=== WIP Container Logic ===');
			console.log(`Container ${s.id} has ${remainingResources} ${resourceType}:`);

			// Iterate through creeps
			for (const creep of creeps) {
				if (creep.id === this.id) continue; // Skip self
				console.log(`${creep.name} will remove ${creep.store.getFreeCapacity(resourceType)}`);
				going += creep.store.getFreeCapacity(resourceType);
			}

			console.log(`${going} >= ${remainingResources} | This is ${going >= remainingResources ? 'an invalid' : 'a valid'} withdraw container.`);
			console.log('=== WIP Container Logic ===');

			if (going >= remainingResources) return false;
			return true;
		}
	});
	if (priority) return priority;

	const secondary = this.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => s.structureType === STRUCTURE_SPAWN && s.store.getUsedCapacity(resourceType) > 0
	});
	return secondary;
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
		// Priority 1: Spawns, extensions, containers
		this.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (s) =>
				// TODO: The 'if courier exists' part should encapsulate the entire structure types list.
				// TODO: This should really be rewritten into a function instead of a bunch of operators
				(s.structureType === STRUCTURE_SPAWN || // It can be a spawn
					s.structureType === STRUCTURE_EXTENSION || // It can be an extension
					(this.memory.role === 'harvester' // If it's a harvester, add the following conditions for containers
						? (Object.values(Game.creeps).find((c) => c.memory.role === 'courier') && // If there's a courier on the map...
								s.structureType === STRUCTURE_CONTAINER && // It can be a container
								s.getType() === 'DEPOSIT') ||
						  s.structureType === STRUCTURE_CONTAINER
						: s.structureType === STRUCTURE_CONTAINER && s.getType() === 'DEPOSIT')) && // Otherwise, it can be a container
				s.store.getFreeCapacity(resourceType) > 0 // It has to have free capacity
		}) ||
		// Priority 2: Towers
		this.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (s) =>
				s.structureType == STRUCTURE_TOWER && // It can be a tower
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
	if (this.memory.idle) {
		// Find closest structure
		const structure = this.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.pos !== this.pos });

		// If there's no nearby structure, return
		if (!structure) return;
		else console.log(`[${this.name}] Idle and in the way, moving...`);

		// Determine cardinal direction to structure
		const direction = this.pos.getDirectionTo(structure);

		// TODO: Determine which of the following three directions is empty

		// Determine & move to the direct opposite direction
		const opposite = this.getOppositeDirection(direction);
		this.move(opposite);

		// Determine & move to the left opposite direction
		const leftOpposite = opposite - 1;
		if (leftOpposite === 0) leftOpposite = 8;
		this.move(leftOpposite);

		// Determine & move to the right opposite direction
		const rightOpposite = opposite + 1;
		if (rightOpposite === 9) rightOpposite = 1;
		this.move(rightOpposite);
	}
};

/***
 * Returns closest repairable structure
 */
Creep.prototype.getClosestRepairStructure = function () {
	return this.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => {
			let max = s.hitsMax;
			if (s.structureType === STRUCTURE_WALL) max = 1000;
			return s.hits < max;
		}
	});
};

/***
 * Returns the opposite cardinal direction
 */
Creep.prototype.getOppositeDirection = function (direction) {
	return {
		TOP: BOTTOM,
		TOP_RIGHT: BOTTOM_LEFT,
		RIGHT: LEFT,
		BOTTOM_RIGHT: TOP_LEFT,
		BOTTOM: TOP,
		BOTTOM_LEFT: TOP_RIGHT,
		LEFT: RIGHT,
		TOP_LEFT: BOTTOM_RIGHT
	}[direction];
};
