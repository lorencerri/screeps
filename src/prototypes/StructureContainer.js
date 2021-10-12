/**
 * Returns whether or not the container is DEPOSIT, WITHDRAW, or STORAGE.
 *
 * Deposit:
 * - Within three tiles of a controller.
 *
 * Withdraw:
 * - Within three tiles of a source.
 *
 *
 *
 * NOTE: Deposit and storage are essentially the same.
 * Storage:
 * - Anywhere else.
 */
StructureContainer.prototype.getType = function () {
	if (this.pos.getRangeTo(this.room.controller) <= 3) {
		return 'DEPOSIT';
	} else if (this.pos.getRangeTo(this.pos.findClosestByRange(FIND_SOURCES)) <= 3) {
		return 'WITHDRAW';
	} else {
		return 'STORAGE';
	}
};
