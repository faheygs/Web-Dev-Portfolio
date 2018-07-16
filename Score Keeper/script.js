var p1 = document.querySelector("#p1");
var p1Display = document.querySelector("#p1Display");
var p1Score = 0;

var p2 = document.querySelector("#p2");
var p2Display = document.querySelector("#p2Display");
var p2Score = 0;

var winningScore = 5;
var gameOver = false;
var h1 = document.querySelector("h1");
var reset = document.querySelector("#reset");
var input = document.querySelector("input");
var scoreDisplay = document.querySelector("p span");



p1.addEventListener("click", function() {
	if (!gameOver) {
		p1Score++;

		if (p1Score === winningScore) {
			p1Display.classList.add("winner");
			gameOver = true;
		}

		p1Display.textContent = p1Score;
	}
});

p2.addEventListener("click", function() {
	if (!gameOver) {
		p2Score++;

		if (p2Score === winningScore) {
			p2Display.classList.add("winner");
			gameOver = true;
		}

		p2Display.textContent = p2Score;
	}
});

reset.addEventListener("click", function() {
	resetGame();
});

input.addEventListener("change", function() {
	scoreDisplay.textContent = this.value;
	winningScore = Number(this.value);
	resetGame();
});




function resetGame() {
	p1Score = 0;
	p1Display.textContent = 0;
	p1Display.classList.remove("winner");
	p2Score = 0;
	p2Display.textContent = 0;
	p2Display.classList.remove("winner");
	gameOver = false;
}