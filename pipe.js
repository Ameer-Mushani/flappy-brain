class Pipe {
    constructor() {
      // gap space
      let spacing = 125;
      // center of gap
      let centerY = mainGame.random(spacing, mainGame.height - spacing);
      this.top = centerY - spacing / 2;
      this.bottom = mainGame.height - (centerY + spacing / 2);
      this.x = mainGame.width;
      this.width = 75;
      this.speed = 6;
    }
  
    detectCollision(bird) {
      if ((bird.y - bird.r) < this.top || (bird.y + bird.r) > (mainGame.height - this.bottom)) {
        if (bird.x > this.x && bird.x < this.x + this.width) {
          return true;
        }
      }
      return false;
    }

    show() {
      mainGame.stroke(255);
      mainGame.fill(200);
      mainGame.rect(this.x, 0, this.width, this.top);
      mainGame.rect(this.x, mainGame.height - this.bottom, this.width, this.bottom);
    }
  
    update() {
      this.x -= this.speed;
    }
  
    offscreen() {
      if (this.x < -this.width) {
        return true;
      } else {
        return false;
      }
    }
  }