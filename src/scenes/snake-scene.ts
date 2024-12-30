import { ASSETS } from '@src/assets';
import { CONSTANTS } from '@src/configs/game.config';
import { Position, SnakeState } from '@src/libs/types/game';
import { useGameStore } from '@src/stores/game';
import { Scene } from 'phaser';

export class SnakeScene extends Scene {
  private snake!: SnakeState;
  private food!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private gridSize: number = CONSTANTS.GRID_SIZE;
  private grid: { x: number; y: number } = { x: 0, y: 0 };
  private moveTimer: number = 0;
  private currentSpeed: number = CONSTANTS.INITIAL_GAME_SPEED;
  private isMoving: boolean = false;
  private foodImages: Array<{ key: string; weight: number }>;
  private lastInputTime: number = 0;
  private inputDelay: number = 50; // Minimum time between inputs in milliseconds
  private nextDirection: Position | null = null;
  private isPaused: boolean = false;

  constructor() {
    super({ key: 'SnakeScene' });
    this.foodImages = [
      { key: CONSTANTS.FOOD_IMAGES.FOOD1, weight: CONSTANTS.FOOD_WEIGHTS.FOOD1 },
      { key: CONSTANTS.FOOD_IMAGES.FOOD2, weight: CONSTANTS.FOOD_WEIGHTS.FOOD2 },
      { key: CONSTANTS.FOOD_IMAGES.FOOD3, weight: CONSTANTS.FOOD_WEIGHTS.FOOD3 },
    ];
  }

  preload(): void {
    this.load.image(CONSTANTS.SNAKE_IMAGES.HEAD, ASSETS.head);
    this.load.image(CONSTANTS.SNAKE_IMAGES.BODY, ASSETS.body);
    this.load.image(CONSTANTS.SNAKE_IMAGES.TAIL, ASSETS.tail);
    this.load.image(CONSTANTS.FOOD_IMAGES.FOOD1, ASSETS.food);
    this.load.image(CONSTANTS.FOOD_IMAGES.FOOD2, ASSETS.heartShadowIcon);
    this.load.image(CONSTANTS.FOOD_IMAGES.FOOD3, ASSETS.pointIcon);
  }

  create(): void {
    try {
      this.setupGrid();
      this.initializeSnake();
      this.initializeFood();
      this.setupControls();
      this.currentSpeed = CONSTANTS.INITIAL_GAME_SPEED;

      // Set proper sprite sizes
      this.snake.body.forEach((segment) => {
        segment.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);
      });
      this.food.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);

      this.listenForPause();
    } catch (error) {
      console.error('Scene creation error:', error);
      // Attempt recovery
      this.scene.restart();
    }
  }

  private listenForPause(): void {
    this.input.keyboard?.on('keydown-SPACE', () => this.togglePause());
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  private getRandomFoodImage(): string {
    const totalWeight = this.foodImages.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const food of this.foodImages) {
      random -= food.weight;
      if (random <= 0) {
        return food.key;
      }
    }

    // Fallback to first food if something goes wrong
    return this.foodImages[0].key;
  }

  private setupGrid(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    this.grid = {
      x: Math.floor((width - CONSTANTS.SPRITE_SIZE) / this.gridSize),
      y: Math.floor((height - CONSTANTS.SPRITE_SIZE) / this.gridSize),
    };
  }

  private initializeFood(): void {
    this.food = this.add.sprite(0, 0, this.getRandomFoodImage());
    this.food.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);
    this.placeFood();
  }

  private initializeSnake(): void {
    const offset = CONSTANTS.SPRITE_SIZE / 2;
    const centerX = offset + Math.floor(this.grid.x / 2) * this.gridSize;
    const centerY = offset + Math.floor(this.grid.y / 2) * this.gridSize;

    const head = this.add.sprite(centerX, centerY, CONSTANTS.SNAKE_IMAGES.HEAD);
    head.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);

    const bodySegments = [];
    for (let i = 1; i < CONSTANTS.INITIAL_SNAKE_LENGTH - 1; i++) {
      const segment = this.add.sprite(centerX - i * this.gridSize, centerY, CONSTANTS.SNAKE_IMAGES.BODY);
      segment.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);
      bodySegments.push(segment);
    }

    const tail = this.add.sprite(
      centerX - (CONSTANTS.INITIAL_SNAKE_LENGTH - 1) * this.gridSize,
      centerY,
      CONSTANTS.SNAKE_IMAGES.TAIL
    );
    tail.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);

    this.snake = {
      body: [head, ...bodySegments, tail],
      size: this.gridSize,
      direction: { x: 1, y: 0 },
    };
  }

  private setupControls(): void {
    this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
    this.setupTouchControls();
  }

  private setupTouchControls(): void {
    let touchStartX: number = 0;
    let touchStartY: number = 0;
    let lastTouchTime = 0;
    const touchDelay = 50;
    const minSwipeDistance = 30; // Minimum distance for a swipe to register

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      touchStartX = pointer.x;
      touchStartY = pointer.y;
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const now = Date.now();
      if (now - lastTouchTime < touchDelay) return;
      lastTouchTime = now;

      const swipeX = pointer.x - touchStartX;
      const swipeY = pointer.y - touchStartY;

      // Check if swipe distance is long enough
      if (Math.abs(swipeX) < minSwipeDistance && Math.abs(swipeY) < minSwipeDistance) {
        return; // Too short to be a swipe
      }

      if (!this.isMoving) {
        this.isMoving = true;
      }

      // Determine swipe direction
      if (Math.abs(swipeX) > Math.abs(swipeY)) {
        // Horizontal swipe
        if (swipeX > 0) {
          this.setDirection('right');
        } else {
          this.setDirection('left');
        }
      } else {
        // Vertical swipe
        if (swipeY > 0) {
          this.setDirection('down');
        } else {
          this.setDirection('up');
        }
      }
    });
  }

  private handleSwipeDirection(angle: number): void {
    if (Math.abs(angle) < Math.PI / 4) this.setDirection('right');
    else if (Math.abs(angle) > (3 * Math.PI) / 4) this.setDirection('left');
    else if (angle > 0) this.setDirection('down');
    else this.setDirection('up');
  }

  private setDirection(dir: 'up' | 'down' | 'left' | 'right'): void {
    const now = Date.now();

    if (now - this.lastInputTime < this.inputDelay) {
      // Store the input for next update
      const directions: Record<typeof dir, Position> = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };

      const newDir = directions[dir];
      const current = this.snake.direction;

      // Only store valid direction changes (no 180-degree turns)
      if (current.x !== -newDir.x && current.y !== -newDir.y) {
        this.nextDirection = newDir;
      }
      return;
    }

    const directions: Record<typeof dir, Position> = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };

    const newDir = directions[dir];
    const current = this.snake.direction;

    if (current.x !== -newDir.x && current.y !== -newDir.y) {
      this.snake.direction = newDir;
      this.lastInputTime = now;
      this.nextDirection = null;
    }
  }

  private checkCollision(): boolean {
    const head = this.snake.body[0];
    return this.checkWallCollision(head) || this.checkSelfCollision(head);
  }

  private checkWallCollision(head: Phaser.GameObjects.Sprite): boolean {
    const headX = Math.round(head.x);
    const headY = Math.round(head.y);

    return (
      headX < CONSTANTS.SPRITE_SIZE / 2 ||
      headX > this.scale.width - CONSTANTS.SPRITE_SIZE / 2 ||
      headY < CONSTANTS.SPRITE_SIZE / 2 ||
      headY > this.scale.height - CONSTANTS.SPRITE_SIZE / 2
    );
  }

  private checkSelfCollision(head: Phaser.GameObjects.Sprite): boolean {
    return this.snake.body.slice(1).some((segment) => head.x === segment.x && head.y === segment.y);
  }

  update(time: number): void {
    if (this.isPaused) return;

    if (!this.isMoving) {
      this.handleInput();
      return;
    }

    // Only move the snake when enough time has passed
    if (this.nextDirection && time > this.moveTimer) {
      const current = this.snake.direction;
      if (current.x !== -this.nextDirection.x && current.y !== -this.nextDirection.y) {
        this.snake.direction = this.nextDirection;
        this.nextDirection = null;
      }
    }

    this.handleInput();

    if (time > this.moveTimer) {
      this.moveSnake();
      this.moveTimer = time + this.currentSpeed;
    }

    this.checkGameOver();
  }

  private moveSnake(): void {
    const head = this.snake.body[0];
    const newX = head.x + this.snake.direction.x * this.gridSize;
    const newY = head.y + this.snake.direction.y * this.gridSize;

    const newHead = this.add.sprite(newX, newY, CONSTANTS.SNAKE_IMAGES.HEAD);
    newHead.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);
    this.snake.body.unshift(newHead);

    head.setTexture(CONSTANTS.SNAKE_IMAGES.BODY);
    head.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);

    if (this.checkFoodCollision(newHead)) {
      this.handleFoodCollection();
      // Update last segment to body texture since it's no longer the tail
      const lastSegment = this.snake.body[this.snake.body.length - 1];
      lastSegment.setTexture(CONSTANTS.SNAKE_IMAGES.BODY);
      lastSegment.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);
    } else {
      this.snake.body.pop()?.destroy();
    }

    // Update tail texture
    const tail = this.snake.body[this.snake.body.length - 1];
    tail.setTexture(CONSTANTS.SNAKE_IMAGES.TAIL);
    tail.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);

    //
    // Update all sprites' rotations
    this.updateSnakeSprites();
  }

  private rotateSprite(sprite: Phaser.GameObjects.Sprite, direction: Position) {
    // Calculate angle based on direction
    if (direction.x === 1) {
      // Right
      sprite.setAngle(0);
    } else if (direction.x === -1) {
      // Left
      sprite.setAngle(180);
    } else if (direction.y === -1) {
      // Up
      sprite.setAngle(-90);
    } else if (direction.y === 1) {
      // Down
      sprite.setAngle(90);
    }
  }

  private updateSnakeSprites() {
    const segments = this.snake.body;

    // Update head
    const head = segments[0];
    this.rotateSprite(head, this.snake.direction);

    // Update body segments
    for (let i = 1; i < segments.length - 1; i++) {
      const current = segments[i];
      const prev = segments[i - 1];
      const next = segments[i + 1];

      // Calculate direction to previous and next segments
      const toPrev = {
        x: prev.x - current.x,
        y: prev.y - current.y,
      };
      const toNext = {
        x: next.x - current.x,
        y: next.y - current.y,
      };

      // If it's a straight segment
      if (toPrev.x === -toNext.x || toPrev.y === -toNext.y) {
        if (toPrev.x !== 0) {
          current.setAngle(this.snake.direction.x === 1 ? 0 : -180); // Always keep horizontal segments at 0 degrees
        }
        // For vertical segments
        else {
          current.setAngle(this.snake.direction.y === 1 ? 90 : -90); // Always keep vertical segments at 90 degrees
        }
      }
      // If it's a corner
      else {
        let angle = 0;
        if ((toPrev.x === 0 && toNext.y === 0) || (toPrev.y === 0 && toNext.x === 0)) {
          if ((toPrev.y < 0 && toNext.x > 0) || (toPrev.x > 0 && toNext.y < 0)) angle = 0;
          if ((toPrev.y < 0 && toNext.x < 0) || (toPrev.x < 0 && toNext.y < 0)) angle = -90;
          if ((toPrev.y > 0 && toNext.x < 0) || (toPrev.x < 0 && toNext.y > 0)) angle = -180;
          if ((toPrev.y > 0 && toNext.x > 0) || (toPrev.x > 0 && toNext.y > 0)) angle = 90;
        }
        current.setAngle(angle);
      }
    }

    // Update tail
    const tail = segments[segments.length - 1];
    const beforeTail = segments[segments.length - 2];
    const toBeforeTail = {
      x: beforeTail.x - tail.x,
      y: beforeTail.y - tail.y,
    };

    if (toBeforeTail.x > 0) tail.setAngle(0);
    else if (toBeforeTail.x < 0) tail.setAngle(180);
    else if (toBeforeTail.y < 0) tail.setAngle(-90);
    else if (toBeforeTail.y > 0) tail.setAngle(90);
  }

  private handleFoodCollection(): void {
    const store = useGameStore.getState();
    store.setScore(store.score + 10);
    // Increase speed (decrease delay) but don't go faster than MIN_GAME_SPEED
    this.currentSpeed = Math.max(CONSTANTS.MIN_GAME_SPEED, this.currentSpeed - CONSTANTS.SPEED_DECREASE);
    this.food.setTexture(this.getRandomFoodImage());
    this.food.setDisplaySize(CONSTANTS.SPRITE_SIZE, CONSTANTS.SPRITE_SIZE);
    this.placeFood();
  }

  private handleInput(): void {
    if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
      if (!this.isMoving) {
        this.isMoving = true;
      }
    }

    if (this.cursors.left.isDown) this.setDirection('left');
    if (this.cursors.right.isDown) this.setDirection('right');
    if (this.cursors.up.isDown) this.setDirection('up');
    if (this.cursors.down.isDown) this.setDirection('down');
  }

  private checkGameOver(): void {
    if (this.checkCollision()) {
      this.handleGameOver();
    }
  }

  private handleGameOver(): void {
    this.isMoving = false;

    this.scene.pause();
    window.dispatchEvent(new CustomEvent('game-over'));
  }

  private checkFoodCollision(head: Phaser.GameObjects.Sprite): boolean {
    // Round positions to grid for accurate collision detection
    const headX = Math.round(head.x / this.gridSize) * this.gridSize;
    const headY = Math.round(head.y / this.gridSize) * this.gridSize;
    const foodX = Math.round(this.food.x / this.gridSize) * this.gridSize;
    const foodY = Math.round(this.food.y / this.gridSize) * this.gridSize;

    return headX === foodX && headY === foodY;
  }

  private placeFood(): void {
    const offset = CONSTANTS.SPRITE_SIZE / 2;
    let x: number = 0,
      y: number = 0;
    let isValid = false;

    while (!isValid) {
      x = offset + Math.floor(Math.random() * this.grid.x) * this.gridSize;
      y = offset + Math.floor(Math.random() * this.grid.y) * this.gridSize;

      // Check if position is valid (not on snake)
      isValid = !this.snake.body.some((segment) => {
        return Math.abs(segment.x - x) < this.gridSize / 2 && Math.abs(segment.y - y) < this.gridSize / 2;
      });
    }

    this.food.setPosition(x, y);
  }

  private isFoodOnSnake(x: number, y: number): boolean {
    return this.snake.body.some((segment) => {
      // Round positions to grid for accurate comparison
      const segX = Math.round(segment.x / this.gridSize) * this.gridSize;
      const segY = Math.round(segment.y / this.gridSize) * this.gridSize;
      return x === segX && y === segY;
    });
  }
}
