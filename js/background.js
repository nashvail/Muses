// Some variable declarations, that are to be taken as constants
// Title of the menu that is visible in the context menu
var TITLE_SAVE_MENU  = "Remember this";
var ID_SAVE_MENU = "saveNote";
var STORAGE_KEY_NOTES = "notes";


var notes = [];


/*
* -------------------------------------------------
* Updates the local storage when any change is made.
*/
chrome.storage.onChanged.addListener(function(){
    // update the websites to track variable
    chrome.storage.local.get("notes", function(result){
        window.notes = JSON.parse(result[window.STORAGE_KEY_NOTES]);
    });
});


/*
* Function : startUp();
* -----------------------------------------------------
* Initializes click handlers and context menu items.
* Sets up value of variables from the local storage
*/
(function startUp() {
	/*
	* -----------------------------------------------------------
	* Detects the first run of the extension,if it is, it creates
	* apporopriate local storage for storing the notes.
	*/
	// chrome.runtime.onInstalled.addListener(function(details){
	//     if(details.reason == "install"){
	//     	console.log("This is the first time running the ext.");
	//     	var storageKey = window.STORAGE_KEY_NOTES;
	// 		chrome.storage.local.set({ storageKey : JSON.stringify([])}, function(result) {});
	//     }
	// });

	// To add the option to the context menu, that is the menu that is visible when right click is detected
	chrome.contextMenus.create({"title" : TITLE_SAVE_MENU, "id" : ID_SAVE_MENU, "type" : "normal", "contexts" : ["selection"]});

	// Checks for clicks on context menu item clicks created by this extension
	chrome.contextMenus.onClicked.addListener(onClickHandler);

	// Handles clicks on the context menu items
	function onClickHandler(info, tab) {
	  if(info.menuItemId === ID_SAVE_MENU) {
	  	// save the note here
	  	var snappedNote = newStorageNote(info.selectionText);
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

	var isCommonWord = function(word) {
		var commonWords = ["is","several", "call", "called", "are","the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "on", "with", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their ", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "use", "two", "how", "our", "work", "first", "well", "way ", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"];
		return (commonWords.indexOf(word) > -1);
	};

	var wordsArray = text.trim().split(" ");
	var hiddenIndices = []; 
	wordsArray.forEach(function(word, index) {
		// First word of the sentence is not to be hidden
		if(!isCommonWord(word) && index != 0) {
			hiddenIndices.push(index);
		}
	});

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

/*
* Function : deleteNote
* ------------------------------------------------------------------
* Takes in the content of note as parameter and removes the note
* from the 'notes' array whose content matches the supplied argument.
*/
function deleteNote(noteContent) {
	window.notes.forEach(function(note, index) {
		if(note.content === noteContent) {
			window.notes.splice(index, 1);
			chrome.storage.local.set({ "notes": JSON.stringify(window.notes)}, function(result) {
				console.log("note deleted");
			});
		}
	});
}

/*
* Function : saveNote(note content i.e text of the note)
* -----------------------------------------------------
*/
function saveNote(noteContent) {
	var newNote = newStorageNote(noteContent);
	window.notes.push(newNote);
	chrome.storage.local.set({ "notes": JSON.stringify(window.notes)}, function(result) {
		console.log("note added");
	});
}


/*
* Function : newStorageNote(text content of the note)
* ---------------------------------------------------------------
* Returns a new storage note object, that is to be pushed into the 
* notes array.
* Format of the note object is 
* {content : "The content of the note", hidden : [1, 2, 3]}
*/
function newStorageNote(noteContent) {
	var newNote = {};
	newNote.content = noteContent;
	newNote.hidden = getHiddenIndices(newNote.content);

	return newNote;
}
