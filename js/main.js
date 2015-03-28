$(document).ready(function(){
	'use strict';

	// ####################################### START NOTE OBJECT DEFINITON #####################################

	/*
	* Object : Note
	* -----------------------------------------------------
	* Object that defines a single note.
	*/
	function Note(noteText, hiddenIndices) {
		this.noteText = noteText;
		this.wordsArray = noteText.trim().split(" ");
		this.hiddenWordIndices = hiddenIndices;

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
	function initialize() {
		var note = document.querySelector(".note h1");
		var randomNoteFromStorage = chrome.extension.getBackgroundPage().getRandomNote();
		if(randomNoteFromStorage) {
			// show_btn is initially hidden
			$('.show_btn').addClass('important_display');

			var randomNote = new Note(randomNoteFromStorage.content, randomNoteFromStorage.hidden);
			// Get the node holding the note form the DOM

			// clear and add new html to the note holder
			note.innerHTML = "";
			note.innerHTML = randomNote.getNoteHTML;
			// $('.container').fadeIn(300, function(){});
			// Animate in the note
			animateNote(note, randomNote);

			// Position the highlight behind the Note
			var noteContainer = note.getBoundingClientRect();
			var backHilite = document.querySelector(".backhilite");
			assignPosDimAttrs(backHilite, noteContainer.top, 0, 0, noteContainer.height);

			// Red bar that holds the delete button
			var deleteContainer = document.querySelector('.deleteContainer');
			assignPosDimAttrs(deleteContainer, noteContainer.top, "100%", "150px", noteContainer.height);

		} else {
			document.body.innerHTML = "";

			// littleBlub (not a typo) is the name of our cute little mascot
			var littleBlub = document.createElement("img");
			littleBlub.src = "images/little_blub.png";
			littleBlub.className = "little_blub";
			document.body.appendChild(littleBlub);
			$('.little_blub').animate({"margin-top" : "200px"}, 450, 'easeOutQuart');
		}

	}

	/*
	* Function : assignPosDimAttrs(target node, css top attr, css left attr, css width attr, css height attr)
	* -------------------------------------------------------------------------------------------------------
	* assignPosDimAttrs === Assign position and dimension attributes. 
	*/
	function assignPosDimAttrs(node ,style_top, style_left, style_width, style_height) {
		node.style.top = style_top;
		node.style.left = style_left;
		node.style.width = style_width;
		node.style.height = style_height;
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
	initialize();

	// Event listener for the show button(the bulb icon)
	var backHilite = $('.backhilite');
	var deleteContainer = $('.deleteContainer');

	var show_btn = $('.show_btn');
	show_btn.click(function(event){
		show_btn.addClass("cbutton--click");
		deleteContainer.css({"display" : "block"});
		$('.hidden_word').css({"border" : "none"});
		backHilite.animate({"width" : "100%"}, 700, 'easeInOutCirc');
		setTimeout(function(){
			show_btn.removeClass("cbutton--click");
			deleteContainer.animate({"left" : $(window).width() - 150}, 600, 'easeOutQuint');
		}, 500);
		event.stopPropagation();
	});

	// Event listener to the click on delete button
	var delete_btn = $('.deleteContainer img');
	delete_btn.click(function(event) {
		deleteContainer.animate({"left" : 0, "width" : $(window).width()}, 600, 'easeInOutCirc');
		setTimeout(function(){
			// Delete from the database
			chrome.extension.getBackgroundPage().deleteNote($('.note h1').text());

			deleteContainer.animate({"width" : 0}, 500, 'easeInOutCirc');
			deleteContainer.animate({"width" : "150px", "left" : "100%"}, 1); // reset the position real quick
			backHilite.animate({"width" : 0}, 500, 'easeInOutCirc');
		}, 300);
		setTimeout(function() {
			initialize();
		}, 860);
		event.stopPropagation();
	});

	var next_btn = $('.nextNote');
	next_btn.click(function(event){
		initialize();
	});


	
});