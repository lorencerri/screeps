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
		default:
			return '#ffffff';
	}
};

/***
 * Returns the closest depositable structure
 */
Creep.prototype.getClosestDepositStructure = function () {
	const deposit = this.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store.getFreeCapacity() > 0
	});
	return deposit;
};

/***
 * Toggles whether or not the creep is depositing resources
 */
Creep.prototype.switchDepositing = function () {
	if (this.memory.depositing) {
		console.log(`[${this.name}] No longer depositing...`);
		this.memory.depositing = false;
	} else {
		console.log(`[${this.name}] Starting to deposit...`);
		this.memory.depositing = true;
	}
};
