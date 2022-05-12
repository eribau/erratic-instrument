const DIRECTION = {
   IDLE: 0,
   UP: 1,
   DOWN: 2,
   LEFT: 3,
   RIGHT: 4
}

const BALL_SPEED = 4;

const testEvent = new CustomEvent('trigger', {bubbles: false, cancelable: true, detail: [144, 60, 127]});

class Actor {
   constructor(
      width,
      height,
      x,
      y,
      moveX,
      moveY,
      speed,
      initialSpeed
   ) {
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.moveX = moveX;
      this.moveY = moveY;
      this.speed = speed; 
   }
}

class Game {
   constructor() {
      this.canvas = document.querySelector('canvas');
      this.context = this.canvas.getContext('2d');

      this.canvas.width = 600;
      this.canvas.height = 600;

      this.backgroundColor = '#2c3e50';

      this.player = new Actor(30, 30, (this.canvas.width / 2), (this.canvas.height) - 30, 0, DIRECTION.IDLE, 0);

      webAudioXML.setVariable("x", this.player.x);
      webAudioXML.setVariable("y", this.player.y);

      this.acceleration = 2;
      this.deceleration = 0.97;
      this.epsilon = 0.3;

      this.running = false;
      this.inputEnabled = true;
      this.timer = 0;
      this.slowDown = false;
      
      this.draw();
      this.listen();
   }

   draw() {
      // Draw the Background
      this.context.fillStyle = this.backgroundColor;
      this.context.fillRect(
         0,
         0,
         this.canvas.width,
         this.canvas.height
      )
      
      // Draw the Player
      this.context.fillStyle = '#ffffff';

      this.context.fillRect(
         this.player.x,
         this.player.y,
         this.player.width,
         this.player.height
      )

   }

   update() {
      if(this.slowDown) {
         if(this.player.speed > this.epsilon) {
            this.player.speed *= this.deceleration;
         } else {
            this.slowDown = false;
            this.player.moveY = DIRECTION.IDLE;
            this.player.moveX = DIRECTION.IDLE;
         }
      } 

      // Move player
      if(this.player.moveY === DIRECTION.UP) this.player.y -= this.player.speed;
      if(this.player.moveY === DIRECTION.DOWN) this.player.y += this.player.speed;
      if(this.player.moveX === DIRECTION.LEFT) this.player.x -= this.player.speed;
      if(this.player.moveX === DIRECTION.RIGHT) this.player.x += this.player.speed; 

      // Check if player collides with bounding box
      if(this.player.y <= 0) {
         this.player.y = 0;
         this.player.moveY = DIRECTION.DOWN;
         this.debounce();
      }
      if(this.player.y >= (this.canvas.height - this.player.height)) {
         this.player.y = (this.canvas.height - this.player.height);
         this.player.moveY = DIRECTION.UP;
         this.debounce();
      }
      if(this.player.x <= 0) {
         this.player.x = 0;
         this.player.moveX = DIRECTION.RIGHT;
         this.debounce();
      }
      if(this.player.x >= (this.canvas.width - this.player.width)) {
         this.player.x = (this.canvas.width - this.player.width);
         this.player.moveX = DIRECTION.LEFT;
         this.debounce();
      } 

      webAudioXML.setVariable("x", this.player.x);
      webAudioXML.setVariable("y", this.player.y);
   }

   loop() {
      game.update();
      game.draw();

      window.requestAnimationFrame(game.loop);
   }

   listen() {
      document.addEventListener('keydown', (e) => {
         if(this.running === false) {
            this.running = true;
            window.requestAnimationFrame(this.loop);
         }
         
         this.slowDown = false;
         if(this.player.speed < 10) {
            this.player.speed += this.acceleration;
         }

         if(this.inputEnabled) {
            if(e.key === 'ArrowUp' || e.key === 'w') {
               this.player.moveY = DIRECTION.UP;
            }
            if(e.key === 'ArrowDown' || e.key === 's') {
               this.player.moveY = DIRECTION.DOWN;
            }
            if(e.key === 'ArrowLeft' || e.key === 'a') {
               this.player.moveX = DIRECTION.LEFT;
            }
            if(e.key === 'ArrowRight' || e.key === 'd') {
               this.player.moveX = DIRECTION.RIGHT;
            }
         }
      });

      document.addEventListener('keyup', (e) => {
         this.slowDown = true;
      });
   }

   debounce() {
      this.inputEnabled = false;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {this.inputEnabled = true;}, 200);
   }
}

const game = new Game();