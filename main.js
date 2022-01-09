
let totalPopulation = 500;
let activeBirds = [];
let allBirds = [];
let pipes = [];
//frame counter to determine when to add a pipe
let counter = 0;

//interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

let highScore = 0;

let runBest = false;
let runBestButton;
//run main game and neural net diagram as two seperate p5 sketch instances
let mainGame = new p5((sketch) => {
  //anonymous function syntax
  sketch.setup = () => {
    let canvas = sketch.createCanvas(600, 400);
    canvas.parent('mainGame');

    // Access the interface elements
    speedSlider = sketch.select('#speedSlider');
    speedSpan = sketch.select('#speed');
    highScoreSpan = sketch.select('#hs');
    allTimeHighScoreSpan = sketch.select('#ahs');
    runBestButton = sketch.select('#best');
    runBestButton.mousePressed(toggleState);

    // Create a population
    for (let i = 0; i < totalPopulation; i++) {
      let bird = new Bird();
      activeBirds[i] = bird;
      allBirds[i] = bird;
    }
  };
  sketch.draw = () => {
    sketch.background(0);

    // get game speed from slider value
    let cycles = speedSlider.value();
    speedSpan.html(cycles);
  
    for (let n = 0; n < cycles; n++) {
      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        if (pipes[i].offscreen()) {
          pipes.splice(i, 1);
        }
      }
      // run best only
      if (runBest) {
        bestBird.think(pipes);
        bestBird.update();
        for (let j = 0; j < pipes.length; j++) {
          // Start over, bird hit pipe
          if (pipes[j].hits(bestBird)) {
            resetGame();
            break;
          }
        }
  
        if (bestBird.bottomTop()) {
          resetGame();
        }
      } else {
        for (let i = activeBirds.length - 1; i >= 0; i--) {
          let bird = activeBirds[i];
          bird.think(pipes);
          bird.update();
  
          // Check collision
          for (let j = 0; j < pipes.length; j++) {
            if (pipes[j].detectCollision(activeBirds[i])) {
              activeBirds.splice(i, 1);
              break;
            }
          }
  
          if (bird.bottomTop()) {
            activeBirds.splice(i, 1);
          }
  
        }
      }
  
      // add new pipes
      if (counter % 75 == 0) {
        pipes.push(new Pipe());
      }
      counter++;
    }
    //Set high score
    let tempHighScore = 0;
    if (!runBest) {
      let tempBestBird = null;
      for (let i = 0; i < activeBirds.length; i++) {
        let s = activeBirds[i].score;
        if (s > tempHighScore) {
          tempHighScore = s;
          tempBestBird = activeBirds[i];
        }
      }
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
        bestBird = tempBestBird;
      }
    } else {
      tempHighScore = bestBird.score;
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
      }
    }
  
    // Update DOM Elements
    highScoreSpan.html(tempHighScore);
    allTimeHighScoreSpan.html(highScore);

    for (let i = 0; i < pipes.length; i++) {
      pipes[i].show();
    }
  
    if (runBest) {
      bestBird.show();
    } else {
      for (let i = 0; i < activeBirds.length; i++) {
        activeBirds[i].show();
      }
      // If all birds dead -> new generation
      if (activeBirds.length == 0) {
        nextGeneration();
      }
    }
  };
});
let neuralNet = new p5((sketch) => {
  sketch.setup = () => {
    console.log("setup");
    let canvas = sketch.createCanvas(800, 400);
    canvas.parent('neuralNet');
  };
  sketch.draw = () => {
    //write neural net info of best bird
    sketch.textWrap(sketch.CHAR);
    sketch.background(255,255,255);
    sketch.textSize(20);
    sketch.fill(100,100,100);
    sketch.text("Best Player Input", 0, 25);
    sketch.text("Pipe X: " + bestBird.unormalizedInputs[0] + ", Pipe Top Y:" + sketch.round(bestBird.unormalizedInputs[1],2) + ", Pipe Bottom Y:" + sketch.round(bestBird.unormalizedInputs[2],2)
     + ", Ball Y: " + sketch.round(bestBird.unormalizedInputs[3],2) + ", Ball Y Velocity: " + sketch.round(bestBird.unormalizedInputs[4],2), 0, 50, sketch.width, sketch.height);
  };
});
// Toggle the state of the simulation
function toggleState() {
  runBest = !runBest;
  // Show the best bird
  if (runBest) {
    resetGame();
    runBestButton.html('continue training');
    // Go train some more
  } else {
    nextGeneration();
    runBestButton.html('run best');
  }
}
