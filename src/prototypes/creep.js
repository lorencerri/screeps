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
 */
Creep.prototype.getClosestWithdrawStructure = function (resourceType = RESOURCE_ENERGY) {
	return (
		// Priority 1: Containers
		this.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (s) =>
				s.structureType === STRUCTURE_CONTAINER && // It is a container
				s.store.getUsedCapacity(resourceType) > 0 && // It has some resources
				s.type === 'WITHDRAW' // It is further than 3 tiles away from the controller
		}) ||
		// Priority 2: Spawns
		this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_SPAWN && s.store.getUsedCapacity(resourceType) > 0 })
	);
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
				(s.structureType === STRUCTURE_SPAWN || // It can be a spawn
					s.structureType === STRUCTURE_EXTENSION || // It can be an extension
					(this.memory.role === 'harvester' // If it's a harvester, add the following conditions for containers
						? (Object.values(Game.creeps).find((c) => c.memory.role === 'courier') && // If there's a courier on the map...
								s.structureType === STRUCTURE_CONTAINER && // It can be a container
								s.type === 'DEPOSIT') || // But only if it's a deposit container
						  (s.structureType === STRUCTURE_CONTAINER && ['WITHDRAW', 'STORAGE'].includes(s.type)) // Otherwise, it has to be the one nearby
						: s.structureType === STRUCTURE_CONTAINER)) && // Otherwise, it can be a container
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
		const structure = creep.pos.findClosestByRange(FIND_STRUCTURES);

		// If there's no nearby structure, return
		if (!structure) return;
		else console.log(`[${this.name}] Idle and in the way, moving...`);

		// Determine cardinal direction to structure
		const direction = creep.pos.getDirectionTo(structure);

		// Determine & move to the direct opposite direction
		const opposite = Game.getOppositeDirection(direction);
		creep.move(opposite);

		// Determine & move to the left opposite direction
		const leftOpposite = opposite - 1;
		if (leftOpposite === 0) leftOpposite = 8;
		creep.move(leftOpposite);

		// Determine & move to the right opposite direction
		const rightOpposite = opposite + 1;
		if (rightOpposite === 9) rightOpposite = 1;
		creep.move(rightOpposite);
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
