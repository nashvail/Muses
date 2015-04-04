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

			var container = document.querySelector(".container");
			container.innerHTML = ""

			var centered = document.createElement("center");

			// littleBlub (not a typo) is the name of our cute little mascot
			var littleBlub = createElemWithClass("img", "little_blub");
			littleBlub.src = "images/little_blub.png";
			document.body.appendChild(littleBlub);
			$('.little_blub').animate({"margin-top" : "130px"}, 450, 'easeOutBack');
			document.body.appendChild(centered);

			// Little blub couldn't find any notes 
			var noNotesMessage = createElemWithClass("p", "noNotes");
			noNotesMessage.innerText = "Little blub couldn't find any notes!"
			centered.appendChild(noNotesMessage);
			$('.noNotes').animate({"margin-top" : "0px"}, 600, 'easeOutBack');

			// A simple message describing how to capture notes
			var addMessage = createElemWithClass("p", "addMessage")
			addMessage.innerText = "You can clip a note from any site or add one manually";
			centered.appendChild(addMessage);
			$('.addMessage').animate({"margin-top" : "-65px"}, 700, 'easeOutBack');
			
			var addNewButton = createElemWithClass("img", "addNew blankPage");
			addNewButton.src = "images/add_new_icon.png";
			centered.appendChild(addNewButton);

		}

	}

	/*
	* Function : createElemWithClass(the element like "p" or "button", the className for the element)
	* Usage : var addNewButton = createElemWithClass("img", "addNew blankPage")
	* -----------------------------------------------------------------------------------------------
	* Both arguments must be string values
	*/
	function createElemWithClass(elem, nameClass) {
		var newElement = document.createElement(elem);
		newElement.className = nameClass;

		return newElement;
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

	/*
	* Function : reInitialize()
	* -----------------------------------------------------
	* Redraws the content on the screen.
	*/
	function reInitialize() {
		document.location.reload();
	}

	// ####################################### END MISC. FUNCTION DEFINITIONS ################################
	initialize();

	var backHilite = $('.backhilite');
	var deleteContainer = $('.deleteContainer');

	// Event listener for the show button(the bulb icon)
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
			reInitialize();
		}, 860);
		event.stopPropagation();
	});

	// Event listener for the add new button
	var overlay = $('.new_overlay');
	var add_btn = $('.addNew');
	add_btn.click(function(event) {
		overlay.addClass('open');
		$('.new_overlay .new_note').focus();
	});

	// Event listener for the next button
	var next_btn = $('.nextNote');
	next_btn.click(function(event){
		initialize();
	});


	
});