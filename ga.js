function resetGame() {
    counter = 0;
    if (bestBird) {
      bestBird.score = 0;
    }
    pipes = [];
  }
  
  function nextGeneration() {
    resetGame();
    normalizeFitness(allBirds);
    activeBirds = generate(allBirds);
    allBirds = activeBirds.slice();
  }
  
  // Generate a new population of birds
  function generate(oldBirds) {
    let newBirds = [];
    for (let i = 0; i < oldBirds.length; i++) {
      // Select a bird randomly based on fitness
      let bird = poolSelection(oldBirds);
      newBirds[i] = bird;
    }
    return newBirds;
  }
  
// Normalize the fitness values 0-1
  function normalizeFitness(birds) {
    for (let i = 0; i < birds.length; i++) {
      birds[i].score = mainGame.pow(birds[i].score, 2);
    }
  
    // Add up all the scores
    let sum = 0;
    for (let i = 0; i < birds.length; i++) {
      sum += birds[i].score;
    }
    // Divide by the sum
    for (let i = 0; i < birds.length; i++) {
      birds[i].fitness = birds[i].score / sum;
    }
  }
  
  
  // An algorithm for picking one bird from an array
  // based on fitness
  function poolSelection(birds) {
    let index = 0;
    let r = mainGame.random(1);
    while (r > 0) {
      r -= birds[index].fitness;
      index += 1;
    }
    index -= 1;
    return birds[index].copy();
  }