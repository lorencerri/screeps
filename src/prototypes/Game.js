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
