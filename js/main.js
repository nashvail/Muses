'use strict';
function Note(text) {
	this.text = text;
	this.text_array = text.split(" ");
	this.hiddenIndices = [1, 4, 9, 14];
}

var sampleNote = new Note("Some words that are here they need to be omitted just for fun and giggles.");

var sample_note = document.querySelector(".itemOne h1");
sample_note.textContent = processText(sampleNote);

function processText(note) {
	var result = [];
	note.text_array.forEach(function(word, index) {
		if(note.hiddenIndices.indexOf(index) > -1) // if the current word is to be hidden
			result.push(replaceWith(word, "_"));
		else
			result.push(word);
	}); 
	
	return result.join(" ");
}

function replaceWith(string, character) {
	var resultingString = "";
	for(var i = 0 ; i < string.length ; i++)
		resultingString += character;
	return resultingString;
}