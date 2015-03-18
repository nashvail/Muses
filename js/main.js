$(document).ready(function(){
	'use strict';

	var sampleNote = document.querySelector(".itemOne h1");
	var words = sampleNote.innerHTML.trim().split(" ");

	var result = [];
	words.forEach(function(word, index) {
		result.push(addSpan(word, "word_" + (index + 1)));
	});

	var finalHTML = result.join(" ");
	sampleNote.innerHTML = finalHTML;

	function addSpan(string, idName) {
		return '<span id = "' + idName + '">' + string + "</span>";
	}

	var children_words = sampleNote.childNodes;

	var min_delay = 200;
	var max_delay = 700;
	// Now we will add the bokeh effect to this shit right over here
	function randomDelay() {
		return Math.floor(Math.random() * (max_delay - min_delay + 1) + min_delay);
	}

	for(var i = 0 ; i < children_words.length ; i++)
		$(children_words[i]).delay(randomDelay()).animate({"color" : "black"}, 2000,'easeOutQuint', function(){});



}());