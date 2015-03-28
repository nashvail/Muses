(function(){

	var ESC_KEY = 27;
	var RETURN_KEY = 13;

	var add_btn = document.querySelector('.addNew');
	var overlay = $('.new_overlay');
	var noteInput = document.querySelector('.new_note');

	add_btn.addEventListener('click', function(event) {
		overlay.addClass('open');
		$('.new_overlay .new_note').focus();
	});

	noteInput.addEventListener('keydown', function(event) {
		if(event.which === ESC_KEY) {
			noteInput.value = "";
			overlay.removeClass('open');
		}else if(event.which === RETURN_KEY) {
			event.preventDefault();
			if(noteInput.value === ""){
				noteInput.placeholder = "Type a note or hit esc. to exit";
			}else{
				overlay.removeClass('open');
				chrome.extension.getBackgroundPage().saveNote(noteInput.value);
				noteInput.value = "";
			}
		}
	});
})();