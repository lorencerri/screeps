const Terminal = {
	run: function (terminal) {
		// Find all orders for zynthium
		const orders = Game.market.getAllOrders(
			(order) => order.type === ORDER_BUY && order.remainingAmount > 0 && order.resourceType === RESOURCE_ZYNTHIUM
		);

		// Get best order
		const bestOrder = orders.sort((a, b) => b.price - a.price)[0];

		// Sell zynthium
		if (bestOrder) {
			// Display Information
			console.log(
				`${orders.length} orders found | ${orders
					.sort((a, b) => b.price - a.price)
					.map((o) => o.price)
					.join(', ')}`
			);
			console.log(`Best Order: ${bestOrder.remainingAmount} @ ${bestOrder.price}`);

			if (bestOrder.price < 0.1) return;
			const transferEnergyCost = Game.market.calcTransactionCost(bestOrder.remainingAmount, 'W1N1', bestOrder.roomName);
			console.log('transfer cost: ' + transferEnergyCost);

			const deal = Game.market.deal(bestOrder.id, bestOrder.remainingAmount, terminal.room.name);
			console.log(deal);
		}
	}
};

module.exports = Terminal;
