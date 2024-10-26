

//////////////////// GLOBALS ////////////////////
let account = undefined
let graph = undefined
let recipe = undefined
let searchArea = undefined
let groceryArea = undefined
let server = undefined
let socket = undefined


/////////////////// FUNCTIONS ///////////////////
function initGlobals() {
	account = new UserAccount()
	graph = new Graph()
	recipe = new RecipeArea(graph)
	searchArea = new SearchArea(graph)
	groceryArea = new GroceryListArea(graph)
	server = new ServerTalk()
	socket = new Socket(server)
}

function initTriggers() {
	/* Global */
	// Uncomment this if you are developing and want to be alerted with all errors, but they should appear in the console anyway without any of this code.
	/*
	$(window).on("error", function(evt) {
		console.log("jQuery error event:", evt)
		var e = evt.originalEvent // get the javascript event
		console.log("original event:", e)
		if (e.message) {
			console.log("Error:\n\t" + e.message + "\nLine:\n\t" + e.lineno + "\nFile:\n\t" + e.filename)
		} else {
			console.log("Error:\n\t" + e.type + "\nElement:\n\t" + (e.srcElement || e.target))
		}
	})
	*/



	/* Account Window */
	$('.AccountTab').click(function(){
		account.switchTab(this)
	})
	$('#username').keypress(function(event){
		if( event.which === 13 /*Enter*/ ){
			$('#password').focus()
		}
	})
	$('#loginButton').click(account.loginPress.bind(account))
	$('#password').keypress(function(event){
		if( event.which === 13 /*Enter*/ ){
			account.loginPress()
		}
	})
	$('#guestButton').click(account.guestLogin.bind(account))
	$(document).keyup(function(event){
		if( event.which === 27 /*Escape*/ ){
			if (account.username === "") {
				account.guestLogin()
			}
		}
	})



	/* Account Management / Bar */
	$('#accountButton').click(function(){
		$("#AccountPanel").toggle()
	})



	/* recipe area */
	$('#create_meal_button').click(function(){
		let inName = $('#meal_input').val();
		let node = recipe.createNode('meal', inName);

		if (node) {
			$('#meal_input').val(node.shownName) // Update in case it changed
		}
	})
	$('#remove_meal_button').click(function(){
		recipe.removeMeal()
	})
	$('#expandRecipe').click(function(){
		recipe.toggleExpand()
		$('#expandRecipe').blur()
	})
	$('.node_input').keypress(function(event) { // instantaneous processing of input names
		let key = event.which;
		let character = String.fromCharCode(key);
		let allowedKeys = [13] // special keys
		let allowedChars = /[0-9A-Za-z _',:]/g;

		if (allowedKeys.indexOf(key) != -1) return true
		else if (character.match(allowedChars)) return true
		else return false
	})
	$('.node_input').keyup(function(event){
		let key = event.which
		let type = $(this).attr("data-type")
		let inName = $(this).val()
		recipe.keyPress(key, type, inName)

	})
	$("#instr_input").blur(function(event){recipe.saveInstructions()})



	/***** search area *****/
	$('.SearchTab').click(function(){
		searchArea.switchTab(this)
	})
	$('#mealSearch, #ingrSearch').keyup(function(){
		searchArea.launchSearch()
	})

	$('#search_results').on("dragover", function(event){
		event.preventDefault();
		event.originalEvent.dataTransfer.dropEffect = "move";
	})
	$('#search_results').on("drop", function(event){
		event.preventDefault();
		let node_id = event.originalEvent.dataTransfer.getData("text")
		let node = graph.getNodeById(node_id)
		groceryArea.menuCloset.removeNode(node)
		searchArea.launchSearch()
	})



	/***** grocery area *****/
	$('#menuField').on("dragover", function(event){
		event.preventDefault();
		event.originalEvent.dataTransfer.dropEffect = "move";
	})
	$('#menuField').on("drop", function(event){
		event.preventDefault()
		let node_id = event.originalEvent.dataTransfer.getData("text")
		let node = graph.getNodeById(node_id)
		searchArea.closet.removeNode(node)
		groceryArea.menuCloset.add(node)
	})

	$('#print_button').click(groceryArea.groceryCloset.print.bind(groceryArea.groceryCloset)) // weird error occurs here, but it still works?

}

function initBackgroundImage() {
	// set random background for login screen
	let image_bnames = ['charcuterie', 'figs', 'maki', 'masala', 'naan', 'pastry', 'peaches', 'peppers', 'pumpkin', 'steak', 'tea', 'wine']
	//let image_bnames = ['maki']
	let image_fnames = image_bnames.map((s) => s + '.webp')
	let rand_index = Math.floor(Math.random() * image_fnames.length)
	let image_url = 'static/backgrounds/' + image_fnames[rand_index]
	document.body.style.backgroundImage = 'url(' + image_url + ')'
}

// Manage what windows are shown / hidden in html window
function windowManage(cmds) {
	// cmds : dictionary with the following options:
	// 		account    : (T/F) whether the account window will be shown
	// 		recipeDesc : (T/F) whether the recipe description window will be shown

	if ("account" in cmds) {
		if (cmds["account"]) {
			$("#AccountWindow").show()
			$("#AccountBar").hide()
			$("#MainWindow").hide()
		} else {
			$("#AccountWindow").hide()
			$("#AccountBar").show()
			$("#MainWindow").show()
		}
	}

	if ("recipeDesc" in cmds) {
		if (cmds["recipeDesc"]) {
			$("#instr_area").show()
			$("#search_area").hide()
			//$("#menu_area").hide()
			$("#recipe_area").addClass("expanded")
		} else {
			$("#instr_area").hide()
			$("#search_area").show()
			//$("#menu_area").show()
			$("#recipe_area").removeClass("expanded")
		}
	}

	if ("accountPanel" in cmds) {
		if (cmds["accountPanel"]) {
			$("#AccountPanel").show()
		} else {
			$("#AccountPanel").hide()
		}
	}
}






////////////////////// MAIN //////////////////////
$(document).ready(function(){
	// jquery wait till dom loaded (see https://avaminzhang.wordpress.com/2013/06/11/document-ready-vs-window-load/ if any issues)
	// NOTE: body is part of the DOM so it seems we do need to wait for document.ready before loading this. I don't know if we can do anything more in that regard.
	initBackgroundImage() // This function does not use globals so I'm putting it first so that the background image can load as quickly as possible.
	initGlobals()
	initTriggers()

	windowManage({
		"account" : true,
		"recipeDesc" : false,
		"accountPanel" : false
	})
	$(".start_hidden").removeClass("start_hidden") // only need this class during page loading (to hide elements as they load)
})

