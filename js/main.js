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
		this.hiddenWordIndices = [2, 4, 14, 9];

		// Note with the same text stored in HTML form, with span tags around each word, 
		// tags differ for the words that are supposed to be hidden and those that are not
		var that = this;
		this.noteHTML = this.wordsArray.map(function(word, currentWordIndex) {
			if(that.hiddenWordIndices.indexOf(currentWordIndex) > -1) // the word is supposed to be hidden
				return '<span class = "hidden_word">' + word + '</span>';
			else
				return '<span id = "word_' + currentWordIndex + '">' + word + '</span>';
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
	Note.prototype.isHiddenWord = function(wordIndex) {
		return (this.hiddenWordIndices.indexOf(wordIndex) > -1);
	};

	// ####################################### END NOTE OBJECT DEFINITON #####################################

	// ####################################### MISC. FUNCTION DEFINITIONS ####################################

	/*
	* Function : initialize(a note object that holds note)
	* -------------------------------------------------------------------
	* Sets up the viewport by placing respective elements in their places .
	* 'noteObj' is a note object
	*/
	function initialize(noteObj) {
		// Get the node holding the note form the DOM
		var note = document.querySelector(".note h1");

		// clear and add new html to the note holder
		note.innerHTML = "";
		note.innerHTML = noteObj.getNoteHTML;
		$('.container').fadeIn(300, function(){});
		// Animate in the note
		animateNote(note, noteObj);

		// Position the highlight behind the Note
		var noteContainer = note.getBoundingClientRect();
		var backHilite = document.querySelector(".backhilite");
		backHilite.style.top = noteContainer.top;
		backHilite.style.height = noteContainer.height;
		backHilite.style.width = 0;
	}

	/*
	* Function : randomDelay()
	* Usage    : div.delay(randomDelay()).animate(...)
	* -------------------------------------------------------
	* Returns a random number between min_delay and max_delay
	*/
	var min_delay = 0;
	var max_delay = 700;
	function randomDelay() {
		return Math.floor(Math.random() * (max_delay - min_delay + 1) + min_delay);
	}

	/*
	* Function : animateNote(DOM node that holds the note, the object that stores the note)
	* --------------------------------------------------------------------------------------
	* Animates the current note by fading in each word at a time. Supplied argument noteNode
	* is the node, that holds the note
	*/
	function animateNote(noteNode, noteObj) {
		var note_words = noteNode.childNodes;
		// added a 300 milliseconds delay for smoother animation perception
		setTimeout(function(){
			for(var i = 0 ; i < note_words.length ; i+=2){
				// As there are text nodes in between span nodes therefore the actual index of word is the
				// (index / 2)
				if(!noteObj.isHiddenWord(i/2)){
					$(note_words[i]).delay(randomDelay()).animate({"color" : "#34495e"}, 700, function(){});
				}
			}
		}, 300);
	}

	// ####################################### END MISC. FUNCTION DEFINITIONS ################################

	// testing chrome_storage here
	console.log(chrome.extension.getBackgroundPage().getRandomNote());	

	// end playing with the chrome_storage here
	var notes = [
		"All of the thriteen colonies began demanding indpendence in 1775 and gainded in 1776",
		"The more you sleep the better your grades will get as research says for example",
		"Due to the shooting up of Mitosin hormone you are not able to sleep prpoerly when there is light."
	];

	var testerNote = new Note(notes[Math.floor(Math.random() * notes.length)]);
	initialize(testerNote);

	addEventListener("click", function() {
		testerNote = new Note(notes[Math.floor(Math.random() * notes.length)]);
		initialize(testerNote);
	});

	// Event listener for the show button(the bulb icon)
	var show_btn = $('.show_btn');
	show_btn.click(function(event){
		show_btn.addClass("cbutton--click");
		$('.hidden_word').css({"border" : "none"});
		$('.backhilite').animate({"width" : "100%"}, 700, 'easeInOutCirc', function(){});
		setTimeout(function(){
			show_btn.removeClass("cbutton--click");
		}, 500);
		event.stopPropagation();
	});

	
});