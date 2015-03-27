// Some variable declarations, that are to be taken as constants
// Title of the menu that is visible in the context menu
var TITLE_SAVE_MENU  = "Save as a new note";
var ID_SAVE_MENU = "saveNote";
var STORAGE_KEY_NOTES = "notes";


var notes = [
	{content : "Frankenstein is the name of the doctor, NOT the monster",  hidden : [0, 3, 6]}
];

/*
* -----------------------------------------------------------
* Detects the first run of the extension,if it is, it creates
* apporopriate local storage for storing the notes.
*/
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
    	var storageKey = window.STORAGE_KEY_NOTES;
		chrome.storage.local.set({ storageKey : JSON.stringify(window.notes)}, function(result) {});
    }
});

/*
* -------------------------------------------------
* Updates the local storage when any change is made.
*/
chrome.storage.onChanged.addListener(function(){
    // update the websites to track variable
    chrome.storage.local.get("notes", function(result){
        window.notes = JSON.parse(result[window.STORAGE_KEY_NOTES]);
        console.log(window.notes);
    });
});


/*
* Function : startUp();
* -----------------------------------------------------
* Initializes click handlers and context menu items.
* Sets up value of variables from the local sotrage
*/
(function startUp() {
	// To add the option to the context menu, that is the menu that is visible when right click is detected
	chrome.contextMenus.create({"title" : TITLE_SAVE_MENU, "id" : ID_SAVE_MENU, "type" : "normal", "contexts" : ["selection"]});

	// Checks for clicks on context menu item clicks created by this extension
	chrome.contextMenus.onClicked.addListener(onClickHandler);

	// Handles clicks on the context menu items
	function onClickHandler(info, tab) {
	  if(info.menuItemId === ID_SAVE_MENU) {
	  	// save the note here
	  	var snappedNote = {};
	  	snappedNote.content = info.selectionText;
	  	snappedNote.hidden = getHiddenIndices(snappedNote.content);
	  	window.notes.push(snappedNote)
	  	chrome.storage.local.set({"notes" : JSON.stringify(window.notes)}, function(){});
	  }
	}

	// Add data to the notes array from the local storage
	chrome.storage.local.get(window.STORAGE_KEY_NOTES, function(result){
		window.notes = [].concat(JSON.parse(result[window.STORAGE_KEY_NOTES]));
	});
})();

/*
* Function : getHiddenIndices
* Usage    : snappedNote.hidden = getHiddenIndicies(snappedNote.content);
* -----------------------------------------------------------------------
* Returns an array containing the index of words that are supposed to be hidden
* while displaying the fact/quote. Never hides the first word
*/

function getHiddenIndices(text) {
	var wordsArray = text.trim().split(" ");
	var hiddenIndices = []; 
	wordsArray.forEach(function(word, index) {
		// First word of the sentence is not to be hidden
		if(!isCommonWord(word) && index != 0) {
			hiddenIndices.push(index);
		}
	});

	var commonWords = ["is","several", "call", "called", "are","the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "on", "with", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their ", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "use", "two", "how", "our", "work", "first", "well", "way ", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"];
	function isCommonWord(word) {
		return (commonWords.indexOf(word) > -1);
	}

	// Only hide maximum of 30% of total words in the note
	var maxHiddenAllowed = Math.ceil(0.30 * wordsArray.length);
	if(hiddenIndices.length > maxHiddenAllowed) {
		var removeCount = hiddenIndices.length - maxHiddenAllowed;
		for(var i = 0 ; i < removeCount ; i++) {
			var toRemoveIndex = Math.floor(Math.random() * hiddenIndices.length);
			hiddenIndices.splice(toRemoveIndex, 1);
		}
	}
	return hiddenIndices;
}

/*
* Function : getRandomNote()
* ---------------------------
*/
function getRandomNote() {
	if(notes.length === 0) return "";
	else return notes[Math.floor(Math.random() * notes.length)];
}
