// Dependencies
var mathLib = require('./lib/math');
var jokesLib = require('./lib/jokes');

// App object
var app = {}

// Configuration
app.config = {
  'timeBetweenJokes': 1000
}

// Function that prints out random joke
app.printAJoke = function () {
  // Get all jokes
  var allJokes = jokesLib.allJokes();
  // Get length of all jokes
  var numberOfJokes = allJokes.length;
  // Pick a random number betn. 1 and the number of Jokes
  var randomNumber = mathLib.getRandomNumber(1, numberOfJokes);
  // Get the joke at that position in the array (minus one)
  var selectedJoke = allJokes[randomNumber - 1];
  // Send the joke to the console
  console.log(selectedJoke, '\n');
}

app.indefiniteLoop = function () {
  setInterval(app.printAJoke, app.config.timeBetweenJokes);
}

app.indefiniteLoop();