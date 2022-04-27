const DIRECTION = {
   IDLE: 0,
   UP: 1,
   DOWN: 2,
   LEFT: 3,
   RIGHT: 4
}

const BALL_SPEED = 4;

class Actor {
   constructor(
      width,
      height,
      x,
      y,
      moveX,
      moveY,
      speed
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

      this.canvas.width = 800;
      this.canvas.height = 600;

      this.backgroundColor = '#2c3e50';

      this.player = new Actor(18, 70, 150, (this.canvas.height / 2) - 35, 0, DIRECTION.IDLE, 10);
      this.ball = new Actor(18, 18, this.canvas.width - 150, (this.canvas.height / 2) - 9, DIRECTION.IDLE, DIRECTION.IDLE, BALL_SPEED);

      webAudioXML.setVariable("ballX", this.ball.x);

      this.running = false;
      this.newRound = true;
      this.timer = 0;
      this.round = 1;
      
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

      // Draw the ball
      this.context.fillRect(
         this.ball.x,
         this.ball.y,
         this.ball.width,
         this.ball.height
      )

      // Draw the current round
      this.context.font = '40px Raleway';
      this.context.textAlign = 'center';

      this.context.fillText(
         'Round ' + this.round,
         this.canvas.width / 2,
         100
      );
   }

   update() {
      // Check if the ball collides with bounding box
      if(this.ball.x <= 0) this.resetTurn(); 
      if(this.ball.x >= this.canvas.width - this.ball.width) this.ball.moveX = DIRECTION.LEFT;
      if(this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
      if(this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP; 

      // Move player
      if(this.player.moveY === DIRECTION.UP) this.player.y -= this.player.speed;
      if(this.player.moveY === DIRECTION.DOWN) this.player.y += this.player.speed;

      // Serve ball
      if(this.turnDelayIsOver() && this.newRound) {
         this.ball.moveX = DIRECTION.LEFT;
         this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
         this.ball.y = this.canvas.height / 2; // Math.floor(Math.random() * this.canvas.height - 200) + 200;

         this.newRound = false;
      }

      // Check if player collides with bounding box
      if(this.player.y <= 0) this.player.y = 0;
      if(this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

      // Move ball
      if(this.ball.moveY === DIRECTION.UP) this.ball.y -= this.ball.speed / 1.5;
      else if(this.ball.moveY === DIRECTION.DOWN) this.ball.y += this.ball.speed / 1.5;
      if(this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
      else if(this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

      webAudioXML.setVariable("ballX", this.ball.x);

      // Handle player-ball collision
      if(this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
         if(this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
            this.ball.x = this.player.x + this.ball.width;
            this.ball.moveX = DIRECTION.RIGHT;
         }
      }      
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

         if(e.key === 'ArrowUp' || e.key === 'w') {
            this.player.moveY = DIRECTION.UP;
         }
         if(e.key === 'ArrowDown' || e.key === 's') {
            this.player.moveY = DIRECTION.DOWN;
         }
      });

      document.addEventListener('keyup', (e) => {
         this.player.moveY = DIRECTION.IDLE;
      });
   }

   resetTurn() {
      // Reset ball
      this.ball = new Actor(18, 18, this.canvas.width - 150, (this.canvas.height / 2) - 9, DIRECTION.IDLE, DIRECTION.IDLE, BALL_SPEED)
      this.timer = new Date().getTime();
      this.newRound = true;

      // Increment round number
      this.round++;
   }

   turnDelayIsOver() {
      return ((new Date()).getTime() - this.timer >= 1000);
   }
}

const game = new Game();