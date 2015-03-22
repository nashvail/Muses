// Some variable declarations, that are to be taken as constants
// Title of the menu that is visible in the context menu
var TITLE_SAVE_MENU  = "Save as a new note";
var ID_SAVE_MENU = "saveNote";

// Handles clicks on the context menu items
function onClickHandler(info, tab) {
  if(info.menuItemId === ID_SAVE_MENU) {
  	// save the note here
    alert(info.selectionText) 
  }
};

// Checks for clicks on context menu item clicks created by this extension
chrome.contextMenus.onClicked.addListener(onClickHandler);

// To add the option to the context menu, that is the menu that is visible when right click is detected
chrome.contextMenus.create({"title" : TITLE_SAVE_MENU, "id" : ID_SAVE_MENU, "type" : "normal", "contexts" : ["selection"]});

