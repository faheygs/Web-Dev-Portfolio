// NORM VARIABLES //

//set variable for number squares needed
var numSquares = 6;
//set variable for color array
var colors = [];
//set variable for color that is picked to guess
var pickedColor;


// SELECTOR VARIABLES //

//selector variable for all div's with square class
var squares = document.querySelectorAll(".square");
//selector variable for span with colorDisplay id
var colorDisplay = document.querySelector("#colorDisplay");
//selector variable for span with message id
var messageDisplay = document.querySelector("#message");
//selector variable for only h1 tag
var h1 = document.querySelector("h1");
//selector variable for button with reset id
var resetButton = document.querySelector("#reset");
//selector variable for all buttons with mode class
var modeButtons = document.querySelectorAll(".mode");


// RUN GAME FUNCTION //

//run init function or run the game
init();


// EVENT LISTENERS //

//add click functionality to the resetButton that just
//calls the reset function
resetButton.addEventListener("click", function() {
	reset();
});


// FUNCTIONS //

//init function that sets up the state of the game
function init() {
	//run setupModeButtons function
	setupModeButtons();
    //run setupSquares function
	setupSquares();
	//run reset function
	reset();
}

//changeColor function that takes in a RGB color and
//assigns it to all squares on the page.
function changeColors(color) {
	for (var i = 0; i < squares.length; i++) {
		squares[i].style.backgroundColor = color;
	}
}

//pickColor function that randomly picks a color to
//start the game, that needs to be guessed.
//returns the color to be used in reset function
function pickColor() {
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

//generateRandomColors function that takes in a number
//and adds all random colors to array and returns it
//to be used in the reset function, based on if Easy
//or Hard is selected
function generateRandomColors(num) {
	var arr = [];
	for (var i = 0; i < num; i++) {
		arr.push(randomColor());
	}
	return arr;
}

//randomColor function will generate a random RGB color
//that is used by generateRandomColors function so the
//array in generateRandomColors can obtain all RGB colors
//needed based on Hard or Easy mode
function randomColor() {
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r +", " + g + ", " + b + ")";
}


//reset function that will reset the game back to a
//beginning state, used by the resetButton, Easy Button
//and Hard Button
function reset() {
	colors = generateRandomColors(numSquares);
	//Pick a new color from Array
	pickedColor = pickColor();
	//change colorDisplay to match picked color
	colorDisplay.textContent = pickedColor;
	//Change resetButton text back to New Colors
	resetButton.textContent = "New Colors";
	//Clear out the messageDisplay so it shows nothing
	messageDisplay.textContent = "";
	//change the background color of h1 back to original
	h1.style.backgroundColor = "steelblue";
	//loop through squares array and apply colors also
	//show the correct number of squares based on easy
	//or hard selection
	for (var i = 0; i < squares.length; i++) {
		if (colors[i]) {
			squares[i].style.display = "block";
			squares[i].style.backgroundColor = colors[i];
		} else {
			squares[i].style.display = "none";
		}
	}
}

//setupModeButtons function that loops through both Hard
//and Easy buttons and gives them click functionality
function setupModeButtons() {
	for (var i = 0; i < modeButtons.length; i++) {
		modeButtons[i].addEventListener("click", function() {
			//remove .selected class from both buttons
			modeButtons[0].classList.remove("selected");
			modeButtons[1].classList.remove("selected");
			//add .selected class to button that is pressed
			this.classList.add("selected");
			//if statement, if Easy button is selected set
			//numSquares to 3 or 6 if Hard is selected
			this.textContent === "Easy" ? numSquares = 3: numSquares = 6;
			//run reset function
			reset();
		})
	}
}

//setupSquares function that loops through all squares
//and gives them click functionality
function setupSquares() {
	for (var i = 0; i < squares.length; i++) {
		squares[i].addEventListener("click", function() {
			//store the background-color value of the square
			//that is clicked
			var clickedColor = this.style.backgroundColor;
			//if statement comparing clickedColor to pickedColor
			if(clickedColor === pickedColor) {
				//if a match, messageDisplay shows correct
				messageDisplay.textContent = "Correct!";
				//changeColors function is called and that
				//value is passed to all squares
				changeColors(clickedColor);
				//h1 background color obtains clickedColor
				h1.style.backgroundColor = clickedColor;
				//resetButton text changes to prompt user
				//to play again
				resetButton.textContent = "Play Again?";
			} else {
				//if not match square fades to color of body bg
				this.style.backgroundColor = "#232323";
				//message prompts user to guess again
				messageDisplay.textContent = "Guess Again!";
			}
		});
	}
}