const getOppositeDirection = (d) => {
	return { 1: 5, 2: 6, 3: 7, 4: 8, 5: 1, 6: 2, 7: 3, 8: 4 }[d];
};

module.exports = { getOppositeDirection };
