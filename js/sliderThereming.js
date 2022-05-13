const DIRECTION = {
   IDLE: 0,
   UP: 1,
   DOWN: 2,
   LEFT: 3,
   RIGHT: 4
}

// Class representing the player 
class Actor {
   constructor(
      width,
      height,
      x,
      y,
      moveX,
      moveY,
      speed,
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

class SliderTheremin {
   constructor() {
      this.canvas = document.querySelector('canvas');
      this.context = this.canvas.getContext('2d');

      this.canvas.width = 600;
      this.canvas.height = 600;

      this.backgroundColor = '#2c3e50';

      this.player = new Actor(30, 30, 40, 40, 0, DIRECTION.IDLE, 0);

      // Initialize webAudioXML variables
      webAudioXML.setVariable("x", this.player.x);
      webAudioXML.setVariable("y", this.player.y);
      webAudioXML.setVariable("vol", 5);

      this.acceleration = 2;
      this.deceleration = 0.97;
      this.epsilon = 0.3;

      this.running = false;
      this.inputEnabled = true;
      this.timer = 0;
      this.slowDown = false;
      
      this.drawInitialScreen();
      this.listen();
   }

   draw() {
      var cornerRadius = 20;
      // Draw the Background
      this.context.fillStyle = '#e7e4dd';
      this.context.fillRect(
         0,
         0,
         this.canvas.width,
         this.canvas.height
      );
      this.context.fillStyle = this.backgroundColor;
      this.context.fillRect(
         cornerRadius,
         cornerRadius,
         this.canvas.width - 2 * cornerRadius,
         this.canvas.height - 2 * cornerRadius
      );
      this.context.fillRect(
         0,
         cornerRadius,
         cornerRadius,
         this.canvas.height - 2 * cornerRadius
      );
      this.context.fillRect(
         cornerRadius,
         0,
         this.canvas.height - 2 * cornerRadius,
         cornerRadius
      );
      this.context.fillRect(
         this.canvas.height - cornerRadius,
         cornerRadius,
         cornerRadius,
         this.canvas.height - 2 * cornerRadius
      );
      this.context.fillRect(
         cornerRadius,
         this.canvas.height - cornerRadius,
         this.canvas.height - 2 * cornerRadius,
         cornerRadius
      );
      this.context.beginPath();
      this.context.arc(
         cornerRadius,
         cornerRadius,
         cornerRadius,
         Math.PI / 2,
         0,
      );
      this.context.fill();
      this.context.beginPath();
      this.context.arc(
         cornerRadius,
         this.canvas.height - cornerRadius,
         cornerRadius,
         Math.PI / 2,
         0,
      );
      this.context.fill();
      this.context.beginPath();
      this.context.arc(
         this.canvas.width - cornerRadius,
         cornerRadius,
         cornerRadius,
         Math.PI / 2,
         0,
      );
      this.context.fill();
      this.context.beginPath();
      this.context.arc(
         this.canvas.width - cornerRadius,
         this.canvas.height - cornerRadius,
         cornerRadius,
         0,
         Math.PI * 2,
      );
      this.context.fill();
      
      // Draw the Player
      this.context.fillStyle = '#e4ac29';
      this.context.beginPath();
      this.context.arc(
         this.player.x,
         this.player.y,
         this.player.width / 2,
         0,
         2 * Math.PI
      );
      this.context.fill();
   }

   drawInitialScreen() {
      this.draw();

      // Draw the starting text
      this.context.fillStyle = '#ffffff'
      this.context.font = '30px sans-serif';
      this.context.fillText(
         'Press any key to start playing',
         this.canvas.width / 2 - 195,
         this.canvas.height / 2
      );
   }

   update() {
      // Reduce speed if the pointer is sliding, or stop if below a certain small value
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
      if(this.player.y >= (this.canvas.height)) {
         this.player.y = (this.canvas.height);
         this.player.moveY = DIRECTION.UP;
         this.debounce();
      }
      if(this.player.x <= 0) {
         this.player.x = 0;
         this.player.moveX = DIRECTION.RIGHT;
         this.debounce();
      }
      if(this.player.x >= (this.canvas.width)) {
         this.player.x = (this.canvas.width );
         this.player.moveX = DIRECTION.LEFT;
         this.debounce();
      } 

      // Update webAudioXML variables
      webAudioXML.setVariable("x", this.player.x);
      webAudioXML.setVariable("y", this.player.y);
   }

   loop() {
      sliderTheremin.update();
      sliderTheremin.draw();

      window.requestAnimationFrame(sliderTheremin.loop);
   }

   listen() {
      // Listen for key presses
      document.addEventListener('keydown', (e) => {
         // Listen for initial key press to start
         if(this.running === false) {
            this.running = true;
            window.requestAnimationFrame(this.loop);
         }
         
         // Accelerate if below max speed
         if(this.player.speed < 10) {
            this.player.speed += this.acceleration;
         }

         // Check for movement direction
         if(this.inputEnabled) {
            if(e.key === 'ArrowUp' || e.key === 'w') {
               this.player.moveY = DIRECTION.DOWN;
               if(this.slowDown) {  // Enable change of direction when sliding
                  this.player.moveX = DIRECTION.IDLE;
               }
            }
            if(e.key === 'ArrowDown' || e.key === 's') {
               this.player.moveY = DIRECTION.UP;
               if(this.slowDown) {
                  this.player.moveX = DIRECTION.IDLE;
               }
            }
            if(e.key === 'ArrowLeft' || e.key === 'a') {
               this.player.moveX = DIRECTION.RIGHT;
               if(this.slowDown) {
                  this.player.moveY = DIRECTION.IDLE;
               }
            }
            if(e.key === 'ArrowRight' || e.key === 'd') {
               this.player.moveX = DIRECTION.LEFT;
               if(this.slowDown) {
                  this.player.moveY = DIRECTION.IDLE;
               }
            }
         }
         this.slowDown = false;
      });

      document.addEventListener('keyup', (e) => {
         // If the key is released start sliding
         this.slowDown = true;
      });
   }

   // Temporarily stop input
   debounce() {
      this.inputEnabled = false;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {this.inputEnabled = true;}, 200);
   }
}

const sliderTheremin = new SliderTheremin();

// const volumeSlider = document.querySelector('#volume');

// volumeSlider.addEventListener('input', getVolume);

// function getVolume() {
//    const vol = parseFloat(volume.value);
   
//    webAudioXML.setVariable("vol", vol);
// };

// webAudioXML.setVariable("vol", 5);