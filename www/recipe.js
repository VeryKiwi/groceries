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
	constructor (graph) {
		this.graph = graph;
		this.boxes = new Boxes(this);
		this.input = new Input();
	}

	/////////////////// HELPERS ///////////////////
	cleanName(type) {
		let cleanName = nameTrim(this.input[type].val())
		if( cleanName === "" ) return false
		return cleanName
	}

	////////////////////////////// Node/Edge Creation/Deletion Functions
	// Note I also combined the keypress function to make one, but I have an if statement to
	// control which function is called. You might want to combine these somehow.
	createNode(type) {
		// Check to see if there is anything worthy in the box
		let nameToAdd = this.cleanName(type)
		if( !nameToAdd ) return false

		let node = this.graph.addNode(type, this.input[type].val());
		return node
	}

	// [ACTION: Add Meal Button] Add a new meal node
	createMeal() {
		// On press of the add meal button, read the contents of the text box for the new meal and add
		// it to the meal nodes
		if( !this.createNode("meal") ) return false

		this.updateDisplay();
		// Put focus on new ingredient field, assuming that's next!
		this.input.ingr.focus();
	}

	// the temporary method I made up
	createNotMeal(type) {
		let node = this.createNode(type)
		if( !node ) {return false}

		// Add edge
		this.graph.addEdge(this.selectedMeal, node);
		this.input[type].val(""); // clear entry box
		this.input[type].addClass("menu_input_box " + type + "_box");

		this.updateDisplay();
	}

	// [ACTION: Remove Meal Button] Remove a recipe
	removeMeal(mealNode = this.selectedMeal) {
		// mealNode : node object of meal to be deleted (default meal to delete is current selection)
		this.graph.removeNode(mealNode); // Delete meal
		this.updateDisplay();
		this.input.meal.focus();
	}


	// [ACTION: Remove node edge] Remove an ingr or tag from a menu
	removeEdge(type, name) {
		let node = this.graph.getNodeByID(type, name);
		if( node === -1 || this.selectedMeal === -1 ){
			throw 'No such node.'
			return false
		}
		this.graph.removeEdge(this.selectedMeal, node);
		if (node.edges.size === 0) {
			this.graph.removeNode(node);
		}
		this.updateDisplay();
		this.input[type].focus();
	}

	/////////////////////////

	// After pressing a key, check the contents of the box and search for existing nodes to match
	search(type) {
		let name = this.cleanName(type)
		if( !name ) return false

		if (type === "meal") {
			// If it's a meal search, update display
			this.updateDisplay();
		}
		else {
			// Otherwise, check to see if the node exists. If so, mark as selected
			let node = this.graph.getNodeByID(type, name);
			if( node === -1 ) this.input[type].removeClass("node_selected")
			else this.input[type].addClass("node_selected")
		}
	}

	// Figure out what meal is selected, or if there is none
	get selectedMeal() {
		// Check what meal node is referenced in the meal input box
		return this.graph.getNodeByID("meal", this.cleanName("meal"));
	}

	////////// Recipe Display Functions

	// Remove all nodes from view
	clearDisplay() {
		// Update meal input box
		this.input.mealButton.val("Add New Meal");
		this.input.mealButton.click(recipe.createMeal);
		// Make meal name unselected
		this.input.meal.addClass("menu_input_box");

		this.boxes.destroy()

		this.input.ingr.css("display", "none");
		this.input.tag.css("display", "none");
	}

	// Show all nodes connected to selected meal
	updateDisplay() {
		let mealNode = this.selectedMeal;
		if( mealNode === -1 ){
			this.clearDisplay()
			return
		}

		// Update meal input box
		this.input.mealButton.value = "Remove Meal";
		this.input.mealButton.click(recipe.removeMeal);
		// Also highlight meal name
		this.input.meal.addClass("node_selected");

		// Show meal recipe
		this.boxes.destroy()
		for (let node of mealNode.edges) {
			this.boxes.add(node)
		}

		// Also show the new ingr and new tag fields
		this.input.ingr.css("display", "inline");
		this.input.tag.css("display", "inline");
		this.search("ingr");
		this.search("tag");
	}
}

class Boxes {
	constructor(recipe) {
		this.recipe = recipe
		this.boxes = []
	}
	add(node) {
		this.boxes.push(new Box(node, this.recipe))
	}
	destroy() {
		for( let box of this.boxes ){
			box.destroy()
		}
		this.boxes = []
	}
}

class Box {
	constructor(node, recipe) {
		this.node = node
		this.recipe = recipe
		this.$el = this.constructElement()
		// attach element to DOM
		$("#" + this.node.type + "_entry").append(this.$el)
	}

	constructElement() {
		return $("<div/>")
			.attr("id", this.id)
			.append(this.constructContents())
			.append(this.constructRemoveButton())
			.addClass("menu_item_box")
			.addClass(this.node.type + "_box")
	}

	constructContents() {
		return $("<div/>")
			.html(this.node.shownName)
			.addClass("box_contents")
	}

	constructRemoveButton() {
		// Add button to remove the item if need be
		let box = this // patch because "this" goes out of scope in function
		return $("<div/>")
			.attr("type", "button")
			.html("&times;")
			.addClass("rmItemButton")
			.click(function(){
				box.recipe.removeEdge(box.node.type, box.node.name)
				box.destroy()
			})
	}

	get id() {
		return "box_el_" + this.node.id
	}

	destroy() {
		this.$el.remove()
	}
}
