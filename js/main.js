$(document).ready(function(){
	'use strict';

	// ####################################### START NOTE OBJECT DEFINITON #####################################

	/*
	* Object : Note
	* -----------------------------------------------------
	* Object that defines a single note.
	*/
	function Note(noteText) {
		this.noteText = noteText;
		this.wordsArray = noteText.trim().split(" ");
		this.hiddenWordIndices = [2, 4, 9, , 14];

		// Note with the same text stored in HTML form, with span tags around each word, 
		// tags differ for the words that are supposed to be hidden and those that are not
		var that = this;
		this.noteHTML = this.wordsArray.map(function(word, index) {
			if(that.hiddenWordIndices.indexOf(index) > -1) // the word is supposed to be hidden
				return '<span id = "word_hidden_' + index + '"  class = "hidden_word">' + word + '</span>';
			else
				return '<span id = "word_' + index + '">' + word + '</span>';
		}).join(" ");
	}

	/*
	* Function : getNoteHTML
	* -----------------------------------------------------
	* Returns the HTML version of the note, that is with each
	* word surrounded by appropriate span tag
	*/
	Object.defineProperty(Note.prototype, "getNoteHTML", {get : function() {
		return this.noteHTML;
	}});

	/*
	* Function : isHiddenWord
	* -----------------------------------------------------
	* Returns true if the supplied word is supposed to be 
	* hidden, false otherwise
	*/
	Note.prototype.isHiddenWord = function(string) {
		return (this.hiddenWordIndices.indexOf(this.wordsArray.indexOf(string)) > -1);
	};

	// ####################################### END NOTE OBJECT DEFINITON #####################################

	// ####################################### MISC. FUNCTION DEFINITIONS ####################################

	/*
	* Function : randomDelay
	* Usage    : div.delay(randomDelay()).animate(...)
	* -------------------------------------------------------
	* Returns a random number between min_delay and max_delay
	*/
	var min_delay = 150;
	var max_delay = 700;
	function randomDelay() {
		return Math.floor(Math.random() * (max_delay - min_delay + 1) + min_delay);
	}

	// ####################################### END MISC. FUNCTION DEFINITIONS ################################


	var testerNote = new Note("All of carbohydrates from the food you eat are then transformed into energy for people.");
	console.log(testerNote.isHiddenWord("that"));

	var note = document.querySelector(".note h1");
	note.innerHTML = testerNote.getNoteHTML;
	console.log(note);

	var words = note.childNodes;

	for(var i = 0 ; i < words.length ; i++){
		if(!testerNote.isHiddenWord(words[i].textContent)){
			$(words[i]).delay(randomDelay()).animate({"color" : "#323232"}, 1500,'easeOutQuint', function(){});
		}
	}
});