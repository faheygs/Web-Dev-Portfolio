//Check off things on your list by striking out
//different li's or items on the list
$("ul").on("click", "li", function() {
	//toggle completed class to either mark or
	//unmark li item as done or not
	$(this).toggleClass("completed");
});

//click the x to delete todo item off of list
$("ul").on("click", "span", function(event) {
	//as item is being deleted fade it out and
	//then delete it from the list
	$(this).parent().fadeOut(500, function() {
		$(this).remove();
	})
	//prevent event bubbling and stop events here
	event.stopPropagation();
});

//select the input field and take the text entered
//and append it to the list as a new item
$("input[type='text']").keypress(function(event) {
	//checking if just the enter key is pressed
	if(event.which === 13) {
		//grab new text from input
		var todoText = $(this).val();
		//clear out input field text and prep for new item
		$(this).val("");
		//create a new li and append it to ul
		$("ul").append("<li><span><i class=\"fas fa-trash-alt\"></i></span> " + todoText + "</li>");
	}
});

//toggle the input field to appear and disapper
//upon clicking the plus button
$("#toggleInput").on("click", function() {
	$("input[type='text']").fadeToggle();
});