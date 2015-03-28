(function(){

	var ESC_KEY = 27;
	var RETURN_KEY = 13;

	var add_btn = document.querySelector('.addNew');
	var overlay = $('.new_overlay');
	add_btn.addEventListener('click', function(event) {
		overlay.addClass('open');
		$('.new_overlay .new_note').focus();
	});

	document.addEventListener('keydown', function(event) {
		if(event.which === ESC_KEY) {
			overlay.removeClass('open');
		}
	});
})();