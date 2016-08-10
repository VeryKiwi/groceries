//Class for all recipe handling in groceries

class Input {
	get meal() {
		return $("#meal_input")
	}
	get ingr() {
		return $("#ingr_input")
	}
	get tag() {
		return $("#tag_input")
	}
	get mealButton() {
		return $("#meal_button")
	}
}

class RecipeArea {
	constructor(graph) {
		this.graph = graph

		function appendLocation(box){
			"#" + box.node.type + "_entry"
		}
		this.boxes = new Boxes(appendLocation, this.removeEdge.bind(this), "menu_item_box")

		this.input = new Input()

		this.mode = "closed"
	}

	keyPress(key, type, shownName) {
		if (key === 13) { // Enter Button
			return this.createNode(type, shownName)
		}
		else {
			this.search(type, shownName)
		}
		return false
	}

	////////////////////////////// Node/Edge Creation/Deletion Functions

	// search for existing nodes connected to this.selectedMeal
	search(type, shownName) {
		if (type === "meal") {
			if( this.selectedMeal ) this.writeDisplay()
			else this.clearDisplay()
		}
		else {
			// Otherwise, check to see if the node exists. If so, mark as selected
			let name = nameTrim(shownName)
			let node = this.graph.getNodeById(type + "_" + name)
			if( node ) this.input[type].addClass("node_selected")
			else this.input[type].removeClass("node_selected")
		}
	}

	// [ACTION] Add a new node
	createNode(type, shownName) {
		if( !nameTrim(shownName) ) return false

		let node = this.graph.addNode(type, shownName)

		if( type !== 'meal' ){
			this.graph.addEdge(this.selectedMeal, node)
			// if the selected meal is on the menu, and it's being added to right now,
			// update the grocery list
			if (groceryArea.menuList.has(this.selectedMeal)) {
				groceryArea.getGroceryList();
			}
			
		}

		this.writeDisplay()

		if( type === 'meal' ){
			// Put focus on new ingredient field, assuming that's next!
			this.input.ingr.focus()
		}

		return node
	}

	// [ACTION: Remove Meal Button] Remove a recipe
	removeMeal(mealNode = this.selectedMeal) {
		// mealNode : node object of meal to be deleted (default meal to delete is current selection)
		this.graph.removeNode(mealNode) // Delete meal
		this.clearDisplay()
		this.input.meal.focus()
	}

	// [ACTION: Remove node edge] Remove an ingr or tag from a menu
	removeEdge(type, name) {
		let node = this.graph.getNodeById(type + "_" + name)
		if( !node || !this.selectedMeal ){
			throw 'No such node.'
			return false
		}
		this.graph.removeEdge(this.selectedMeal, node)
		if (node.edges.size === 0) {
			this.graph.removeNode(node)
		}
		this.input[type].focus()
	}

	/////////////////////////

	// Figure out what meal is selected, or if there is none
	get selectedMeal() {
		let shownName = $('#meal_input').val() // we want something static (for robustness) we can have the event update the jquery el (static jquery el)
		let name = nameTrim(shownName)
		if( !name ) return false

		// Check what meal node is referenced in the meal input box
		return this.graph.getNodeById("meal_" + name)
	}

	// Manually choose a meal to be selected
	selectMeal(node) {
		$('#meal_input').val(node.shownName)
		this.search("meal", node.shownName)
	}

	////////// Recipe Display Functions

	clearDisplay() {
		this._clearBoxes()
		if( this.mode === "open" ) this._toggleDisplay()
		this.mode = "closed"
	}

	writeDisplay() {
		this._clearBoxes()
		if( this.mode === "closed" ) this._toggleDisplay()
		this.mode = "open"

		this._writeNeighbors()
	}

	_toggleDisplay() {
		$('#meal_input').toggleClass("node_selected")
		$('#create_meal_button').toggle()
		$('#remove_meal_button').toggle()
		this.input.ingr.toggle()
		this.input.tag.toggle()
	}

	_clearBoxes() {
		this.boxes.destructElements()
		this.input.ingr.removeClass("node_selected").val("")
		this.input.tag.removeClass("node_selected").val("")
	}

	_writeNeighbors() {
		for (let node of this.selectedMeal.edges) {
			this.boxes.add(node)
		}
	}
}