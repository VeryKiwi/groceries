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
			if (account.username === "" && account.guest === false) {
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

function initAccountWindow() {
	// Any account init things needed...

	// set random background for login screen
	let image_fnames = ['charcuterie.jpg', 'figs.jpg', 'maki.jpg', 'masala.jpg', 'naan.jpg', 'pastry.jpg', 'peaches.jpg', 'peppers.jpg', 'pumpkin.jpg', 'steak.jpg', 'tea.jpg', 'wine.jpg']
	let rand_index = Math.floor(Math.random() * image_fnames.length)
	let image_url = 'static/backgrounds/' + image_fnames[rand_index]
	// alert('setting')
	$('#AccountWindow').css({'background-image': 'url(' + image_url + ')'})
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


/*

///////////////////////// Function to search and display items based on searched items /////////////////////////



//random menu generator
function generate() {
	genNumber=document.getElementById("mealNumValue").value;
	if (genNumber=='') { //if empty, make the value 7
		genNumber=7;
		document.getElementById("mealNumValue").value=genNumber;
	}
	// parse specifications:
	var specText=document.getElementById("mealConditions").value;
	specText+=',0 side';
	specText=specText.replace(/\n/g,","); //change "new line" to ","
	specText=specText.replace(/,\s+|\s+,/g,","); //remove space after and before commas
	specText=specText.replace(/^\s+|\s+$/g,"");//remove space at the beginning and end
	specText=specText.replace(/^\s*,|,\s*$/g,"");//remove empty spots at beginning or end
	specText=specText.replace(/,\s*,/g,",");//remove empty spots in the middle

	var rawSpecList=specText.split(",");//parse into individual specs
	var specList=new Array;//specList[i]=[min,max,ingr,Number added to final menu]
	var form1=/(\d+)\s*\/\s*(\d+)\s+(.+)/;
	var form2=/(\d+)\s+(.+)/;
	for (var i in rawSpecList) { //parse individual specs into min/max/ingr
		//if "#1/#2 ingr" is given, assume min#1, max=#2
		if (form1.test(rawSpecList[i])){
			specList.push([eval(RegExp.$1),eval(RegExp.$2),RegExp.$3,0])
		}
		//if "# ingr" is given, assume min=max=#
		else if (form2.test(rawSpecList[i])){
			specList.push([eval(RegExp.$1),eval(RegExp.$1),RegExp.$2,0])
		}
		//if "ingr" is given, assume min 1, max equal to genNumber
		else {
			specList.push([1,genNumber,rawSpecList[i],0])
		}
	}

	for (var i in specList) { //first go through and replace all ingrs with their pointer
		//if min>max, switch
		if (specList[i][0]>specList[i][1]){var temp=specList[i][1];
			specList[i][1]=specList[i][0];specList[i][0]=temp;}

		if (itemListStrings.indexOf(specList[i][2])!=-1) {
			var itemKey=itemList[itemListStrings.indexOf(specList[i][2])]; //store pointer
			if (itemKey.type>=2) {specList[i][2]=itemKey;} //if an ingr/description
			else {specList.splice(i,1)} //otherwise, remove
		}
		else {specList.splice(i,1)} //otherwise, remove
	}

	var possibleMenuItems=itemSearch(itemList,1,-1,1); //all meal items
	possibleMenuItems=removeMaxes(possibleMenuItems,specList); //remove any 0 max specs
	foundItemList=new Array();
	var finalMenuSize=0;

	//first round through to meet all minima
	for (var i in specList) {

		//find all menu options that contain this ingr
		var mealOptions=itemSearch(possibleMenuItems,1,specList[i][2],1);
		//if we need more menu items, there are still possibilities, the min>0, and this is an actual item
		while (mealOptions.length>0 && finalMenuSize<genNumber && specList[i][0]>specList[i][3]) {

			//add a random option
			var addedMeal=mealOptions[Math.floor(Math.random()*mealOptions.length)];
			finalMenuSize=foundItemList.push(addedMeal);
			addedMeal.found=1;

			//update progress on each spec and remove added meal and any menu items that would exceed any spec maxes
			specList=tallyIngredients(addedMeal,specList);
			possibleMenuItems=removeMeal(possibleMenuItems,addedMeal);
			possibleMenuItems=removeMaxes(possibleMenuItems,specList);

			//find all menu options that contain this ingr
			mealOptions=itemSearch(possibleMenuItems,1,specList[i][2],1);
		}
	}

	//second round, pick randomly from all options while options remain and more menu items are required
	while (possibleMenuItems.length>0 && finalMenuSize<genNumber) {
		//add a random option
		var addedMeal=possibleMenuItems[Math.floor(Math.random()*possibleMenuItems.length)];
		finalMenuSize=foundItemList.push(addedMeal);
		addedMeal.found=1;

		//update progress on each spec and remove added meal and any menu items that would exceed any spec maxes
		specList=tallyIngredients(addedMeal,specList);
		possibleMenuItems=removeMeal(possibleMenuItems,addedMeal);
		possibleMenuItems=removeMaxes(possibleMenuItems,specList);

	}

	positionResults(foundItemList,1);
}



////////////////////////////////////////////////Save all Data////////////////////////////////////////////////
//store data in cookie by combining into string
var savedHistory=[]; //hold history of changes to allow "Undo"
function saveData() {
	var itemStore='';
	for (var i in itemList) {
		if (itemList[i].type==1) {//only store if this is a menu item (assume no lone ingrs)
			if(itemStore!='') {
				itemStore+="|||";
			}
			itemStore+=itemList[i].name;
			itemStore+="||";
			for (var j in itemList[i].connections) {
				if (j>0) {itemStore+="|";}
				itemStore+=itemList[i].connections[j].type+''+itemList[i].connections[j].name; //add type immediately followed by the name
			}
		}
	}

	if (savedHistory[placeInHistory]!=itemStore) {
		if (placeInHistory>0) {savedHistory.splice(0,placeInHistory);
			placeInHistory=0;
			document.getElementById("redoButton").disabled=true;}
		savedHistory.splice(0,0,itemStore);
		if (savedHistory.length>20) {savedHistory.splice(20,1);}
		else if (savedHistory.length==2) {document.getElementById("undoButton").disabled=false;}
	}

	setCookie("itemStore",itemStore)
}

*/


////////////////////// MAIN //////////////////////
$(document).ready(function(){
	// jquery wait till dom loaded (see https://avaminzhang.wordpress.com/2013/06/11/document-ready-vs-window-load/ if any issues)
	initGlobals()
	initTriggers()
	initAccountWindow()

	windowManage({
		"account" : true,
		"recipeDesc" : false,
		"accountPanel" : false
	})
	$(".start_hidden").removeClass("start_hidden") // only need this class during page loading (to hide elements as they load)
})
