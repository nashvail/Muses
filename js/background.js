// Some variable declarations, that are to be taken as constants
// Title of the menu that is visible in the context menu
var TITLE_SAVE_MENU  = "Save as a new note";
var ID_SAVE_MENU = "saveNote";

// IF REQUIRED TO CHANGE THE KEY, change it on line 17 too
var STORAGE_KEY_NOTES = "notes";

// Array that holds the string notes
// We can give initial value to this array if we want to
var notes = [];

// Create entry in the local storage after first time installation
// Will check if this is the first time the extension has been run, if yes then sets the timeSpentOnWebsites to 0
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
    	var storageKey = window.STORAGE_KEY_NOTES;
		chrome.storage.local.set({ storageKey : JSON.stringify(window.notes)}, function(result) {});
    }
});

// Detect for change in storage and update the variables
chrome.storage.onChanged.addListener(function(){
    // update the websites to track variable
    chrome.storage.local.get("notes", function(result){
        window.notes = JSON.parse(result[window.STORAGE_KEY_NOTES]);
        console.log(window.notes);
    });
});

startUp();
function startUp() {
	// ############################### SET UP CONTEXT MENUS AND CLICK HANDLERS ################################

	// Handles clicks on the context menu items
	function onClickHandler(info, tab) {
	  if(info.menuItemId === ID_SAVE_MENU) {
	  	// save the note here
	  	window.notes.push(info.selectionText);
	  	chrome.storage.local.set({"notes" : JSON.stringify(window.notes)}, function(){});
	  }
	}

	// Checks for clicks on context menu item clicks created by this extension
	chrome.contextMenus.onClicked.addListener(onClickHandler);

	// To add the option to the context menu, that is the menu that is visible when right click is detected
	chrome.contextMenus.create({"title" : TITLE_SAVE_MENU, "id" : ID_SAVE_MENU, "type" : "normal", "contexts" : ["selection"]});

	// ############################## SET UP VARIABLES FROM LOCAL STORAGE
	// Add data to the notes array from the local storage
	chrome.storage.local.get(window.STORAGE_KEY_NOTES, function(result){
		window.notes = [].concat(JSON.parse(result[window.STORAGE_KEY_NOTES]));
	});
}


function getRandomNote() {
	if(notes.length === 0) return "";
	else return notes[Math.floor(Math.random() * notes.length)];
}
