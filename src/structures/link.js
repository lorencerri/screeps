const Link = {
	run: function (link) {
		const isControllerLink = link.pos.inRangeTo(link.room.controller, 3);
		if (!isControllerLink) {
			link.transferEnergy(
				link.room.find(FIND_STRUCTURES, {
					filter: (s) => {
						return s.structureType === STRUCTURE_LINK && s.pos.inRangeTo(link.room.controller, 3) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 100;
					}
				})[0]
			);
		}
	}
};

module.exports = Link;
