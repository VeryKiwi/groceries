
class GroceryListArea {
	constructor(graph) {
		this.name = "grocery"
		this.graph = graph // graph storing all nodes
		this.menuCloset = new MenuCloset(this)
		this.groceryCloset = new GroceryCloset(this)
	}

	// Go through all meal nodes and find what is on the menu
	getMenu() {alert("entering grocery.js getMenu()")
		// Assemble the menu list (meal nodes)
		this.menuCloset.destructBoxes()
		let mealNodes = graph.getNodesByID_partial("meal", "")
		for (let meal of mealNodes) {
			if (meal.inMenu) { // i don't think we need to keep track of what's on the menu by using inMenu anymore.  I think we can just use groceryListArea.menuCloset.boxes to see what's on the menu.  This is the next thing to take a look at and understand better. (todo)
				this.menuCloset.add(meal)
			}
		}
		this.updateGroceryList()
	}

	// Collect grocery list based on the menu
	updateGroceryList() {
		// Clear the quantities for all the ingredients
		let ingrNodes = graph.getNodesByID_partial("ingr", "")
		for (let ingr of ingrNodes) {
			ingr.grocQuantity = {
				// unit (string) -> quantity (whole number)
				// intentionally a blank dictionary at first
			};
		}

		// Now go through menu and tally up ingredients
		this.groceryCloset.destructBoxes()
		for (let box of this.menuCloset.boxes) {
			let meal = box.node
			for (let node of meal.edges) {
				if (node.type === "ingr") { // Only tally ingredients
					// todo: detect units
					let unit = ''
					// todo: detect quantity
					let quantity = 5
					// add quantity to dictionary
					if (!node.grocQuantity.hasOwnProperty(unit)) {
						node.grocQuantity[unit] = 0
					}
					node.grocQuantity[unit] += quantity
					// add node to list
					this.groceryCloset.add(node)
				}
			}
		}
		this.groceryCloset.updateBoxes() // ensure quantities are updated
	}

}
