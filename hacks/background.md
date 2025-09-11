---
layout: opencs
title: Background with Object
description: Use JavaScript to have an in motion background.
sprite: /images/platformer/sprites/flying-ufo.png
background: /images/platformer/backgrounds/alien_planet1.jpg
permalink: /background
---

<!-- Canvas where the game will be drawn -->
<canvas id="world"></canvas>

<script>
  // Grab the canvas element and its 2D drawing context
  const canvas = document.getElementById("world");
  const ctx = canvas.getContext('2d');

  // Create image objects for background and sprite
  const backgroundImg = new Image();
  const spriteImg = new Image();

  // Load images using Jekyll variables from front matter
  backgroundImg.src = '{{page.background}}';
  spriteImg.src = '{{page.sprite}}';

  // Track how many images are loaded
  let imagesLoaded = 0;

  // When each image loads, increment count and try starting the game
  backgroundImg.onload = function() {
    imagesLoaded++;
    startGameWorld();
  };
  spriteImg.onload = function() {
    imagesLoaded++;
    startGameWorld();
  };

  // Only start once both images are loaded
  function startGameWorld() {
    if (imagesLoaded < 2) return;

    // Base class for all objects drawn in the game
    class GameObject {
      constructor(image, width, height, x = 0, y = 0, speedRatio = 0) {
        this.image = image;          // image used for drawing
        this.width = width;          // width of object
        this.height = height;        // height of object
        this.x = x;                  // x position
        this.y = y;                  // y position
        this.speedRatio = speedRatio;// how fast relative to game speed
        this.speed = GameWorld.gameSpeed * this.speedRatio; // movement speed
      }
      update() {} 
      draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
    }

    // Background that scrolls horizontally to create parallax effect
    class Background extends GameObject {
      constructor(image, gameWorld) {
        // Fill entire canvas size
        super(image, gameWorld.width, gameWorld.height, 0, 0, 0.1);
      }
      update() {
        // Move left continuously, wrapping around when fully shifted
        this.x = (this.x - this.speed) % this.width;
      }
      draw(ctx) {
        // Draw background twice side-by-side to cover scrolling gap
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }
    }

    // Player sprite floating in the middle of the screen
    class Player extends GameObject {
      constructor(image, gameWorld) {
        // Scale player sprite to half its natural size
        const width = image.naturalWidth / 2;
        const height = image.naturalHeight / 2;
        // Center it in the game world
        const x = (gameWorld.width - width) / 2;
        const y = (gameWorld.height - height) / 2;
        super(image, width, height, x, y);
        this.baseY = y;   // Starting vertical position
        this.frame = 0;   // Frame counter for animation
      }
      update() {
        // Bob up and down using sine wave
        this.y = this.baseY + Math.sin(this.frame * 0.05) * 20;
        this.frame++;
      }
    }

    // Main game world manager
    class GameWorld {
      static gameSpeed = 5; // Global game speed

      constructor(backgroundImg, spriteImg) {
        // Setup canvas dimensions to fill window
        this.canvas = document.getElementById("world");
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Position canvas fullscreen
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `0px`;
        this.canvas.style.top = `${(window.innerHeight - this.height) / 2}px`;

        // Store game objects (background + player)
        this.gameObjects = [
         new Background(backgroundImg, this),
         new Player(spriteImg, this)
        ];
      }

      // Main loop: clears screen, updates and redraws objects
      gameLoop() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (const obj of this.gameObjects) {
          obj.update();
          obj.draw(this.ctx);
        }
        // Call loop again on next animation frame
        requestAnimationFrame(this.gameLoop.bind(this));
      }

      // Start the game
      start() {
        this.gameLoop();
      }
    }

    // Create and start game world
    const world = new GameWorld(backgroundImg, spriteImg);
    world.start();
  }
</script>
