// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&

// Mutation function to be passed into bird.brain
function mutate(x) {
    if (mainGame.random(1) < 0.1) {
      let offset = mainGame.randomGaussian() * 0.5;
      let newx = x + offset;
      return newx;
    } else {
      return x;
    }
  }
  
  class Bird {
    constructor(brain) {
      // position and size of bird
      this.x = 64;
      this.y = mainGame.height / 2;
      this.r = 12;
  
      // Gravity, lift and velocity
      this.gravity = 0.8;
      this.lift = -12;
      this.velocity = 0;
  
      // Is this a copy of another Bird or a new one?
      // The Neural Network is the bird's "brain"
      if (brain instanceof NeuralNetwork) {
        this.brain = brain.copy();
        this.brain.mutate(mutate);
      } else {
        this.brain = new NeuralNetwork(5, 8, 2);
      }
  
      // Score is how many frames it's been alive
      this.score = 0;
      // Fitness is normalized version of score
      this.fitness = 0;
      this.unormalizedInputs = [];
    }
  
    // Create a copy of this bird
    copy() {
      return new Bird(this.brain);
    }
  
    // Display the bird
    show() {
      mainGame.fill(255, 100);
      mainGame.stroke(255);
      mainGame.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }
  
    // This is the key function now that decides
    // if it should jump or not jump!
    think(pipes) {
      // First find the closest pipe
      let closest = null;
      let record = Infinity;
      for (let i = 0; i < pipes.length; i++) {
        let diff = pipes[i].x - this.x;
        if (diff > 0 && diff < record) {
          record = diff;
          closest = pipes[i];
        }
      }
  
      if (closest != null) {
        //store unormalized for neural net diagram
        this.unormalizedInputs[0] = closest.x;
        this.unormalizedInputs[1] = closest.top;
        this.unormalizedInputs[2] = closest.bottom;
        this.unormalizedInputs[3] = this.y;
        this.unormalizedInputs[4] = this.velocity;
        //create normalized (0 to 1 range) inputs for neural network
        let inputs = [];
        inputs[0] = mainGame.map(closest.x, this.x, mainGame.width, 0, 1);
        inputs[1] = mainGame.map(closest.top, 0, mainGame.height, 0, 1);
        inputs[2] = mainGame.map(closest.bottom, 0, mainGame.height, 0, 1);
        inputs[3] = mainGame.map(this.y, 0, mainGame.height, 0, 1);
        inputs[4] = mainGame.map(this.velocity, -5, 5, 0, 1);
  
        // Get the outputs from the network
        let action = this.brain.predict(inputs);
        // Decide to jump or not!
        if (action[1] > action[0]) {
          this.up();
        }
      }
    }
  
    // Jump up
    up() {
      this.velocity += this.lift;
    }
  
    bottomTop() {
      // Bird dies when hits bottom?
      return (this.y > mainGame.height || this.y < 0);
    }
  
    // Update bird's position based on velocity, gravity, etc.
    update() {
      this.velocity += this.gravity;
      // this.velocity *= 0.9;
      this.y += this.velocity;
  
      // Every frame it is alive increases the score
      this.score++;
    }
  }