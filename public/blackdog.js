/**
 *
 * @domelements
 *
 */
const canvasElement = document.querySelector("canvas");
const scoreSprite = document.getElementById("score");
const blackdogSprite = document.getElementById("blackdog");
const coinSprite = document.getElementById("coin");
const enemySprites = {
  R: document.getElementById("enemyR"),
  L: document.getElementById("enemy"),
};
const audios = {
  coin: new Audio("./public/audio/coin.wav"),
  bark: new Audio("./public/audio/bark.wav"),
};
const soundSprite = document.getElementById("sound");

/**
 *
 * @utilities
 *
 */
const compose = (...fs) => (x) => fs.reduceRight((v, f) => f(v), x);

const lazy = (f) => (v) => f(v);

const debug = console.log;

/**
 * @function distance
 * @returns distance between two points
 * @math 𝑑 = √( ( 𝑥2 - 𝑥1 )² + ( 𝑦2 - 𝑦1 )² )
 */
const distance = ({ x, y }) => ({ x: w, y: z }) =>
  Math.sqrt(Math.pow(w - x, 2) + Math.pow(z - y, 2));

const randomIntFromRange = (min) => (max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomIntFromRangeWithPad = (range) => (pad) =>
  randomIntFromRange(pad)(range - pad);

const nonZeroRandomIntFromRange = (min) => (max) => {
  const randomIntFromRange = Math.floor(Math.random() * (max - min + 1) + min);
  return randomIntFromRange === 0
    ? nonZeroRandomIntFromRange(min)(max)
    : randomIntFromRange;
};

const negation = (n) => -n;

const avg = (x) => (y) => x + y / 2;

const divideByTwo = (n) => n / 2;

const not = (f) => !f();

const utils = {
  compose,
  lazy,
  debug,
  distance,
  randomIntFromRange,
  randomIntFromRangeWithPad,
  nonZeroRandomIntFromRange,
  negation,
  avg,
  divideByTwo,
};

/**
 *
 * @partials
 *
 */
const randomPadX = lazy(() => randomIntFromRangeWithPad(innerWidth)(50));
const randomPadY = lazy(() => randomIntFromRangeWithPad(innerHeight)(50));

/**
 *
 * @mechanics
 *
 */
const collider = (divideByTwo) => (distance) => (b) => (a) => {
  const hitboxA = divideByTwo(a.dimension);
  const hitboxB = divideByTwo(b.dimension);
  const distanceAToB = distance(a)(b);
  const colliding = distanceAToB <= hitboxA + hitboxB;
  return colliding;
};

const move = (o) => ({ ...o, x: o.x + o.velocity.x, y: o.y + o.velocity.y });

const spawnEnemies = (n) =>
  [...Array(n)].map((v) =>
    Enemy(randomPadX(50))(randomPadY(50))(40)(enemySprites)(
      nonZeroRandomIntFromRange(-5)(5)
    )
  );

const over = (z) => {
  const { coin, score, enemies } = z;
  coin.respawn(z);
  score.reset(z);
  enemies.length = 0;
};

const moveW = (driver) => (o) => {
  (o.x = driver.x), (o.y = driver.y);
  return o;
};

const mechanics = {
  collider,
  move,
  spawnEnemies,
  over,
  moveW,
};

/**
 *
 * @models
 *
 */
const Canvas = (c) => (w) => (h) => {
  c.ctx = c.getContext("2d");
  c.draw = ({ sprite, x, y, dimension }) =>
    c.ctx.drawImage(sprite, x, y, dimension, dimension);
  c.width = w;
  c.height = h;
  return c;
};

const Mouse = (c) => ({
  x: c.width / 2,
  y: c.width / 2,
});

const Score = (value) => (sprite) => ({
  value,
  sprite,
  //   up({ score, enemy }) {
  //     const enemyArea = Math.pow(enemy.dimension, 2),
  //       windowArea = innerHeight * innerWidth,
  //       enemyPercentage = enemyArea / windowArea;
  //     score.value += enemyPercentage * 1000;
  //     score.sprite.innerHTML = ~~score.value;
  //   },
  //   reset({ score }) {
  //     score.value = 0;
  //   },
});

const Player = (x) => (y) => (dimension) => (sprite) => ({
  x,
  y,
  sprite,
  dimension,
});

const Coin = (x) => (y) => (dimension) => (sprite) => ({
  x,
  y,
  sprite,
  dimension,
  //   respawn({ coin, randomIntFromRange }) {
  //     coin.x = randomIntFromRange(50)(innerWidth - 50);
  //     coin.y = randomIntFromRange(50)(innerHeight - 50);
  //   },
});

const Enemy = (x) => (y) => (dimension) => (sprites) => (speed) => ({
  x,
  y,
  sprite: sprites.L,
  spriteR: sprites.R,
  spriteL: sprites.L,
  dimension,
  velocity: {
    x: speed,
    y: speed,
  },
  //   switchSprite({ enemy }) {
  //     if (enemy.velocity.x < 0) enemy.sprite = enemy.spriteL;
  //     else enemy.sprite = enemy.spriteR;
  //   },
  //   draw({
  //     objects: { enemy, player, sound, c },
  //     mechanics: { collide, move, over },
  //   }) {
  //     /**@mechanic game over when colliding with player */
  //     /**@mechanic play bark sound when colliding with player */
  //     // collide(enemy)(player)(() => {
  //     //   over(z);
  //     //   if (!sound.bark.muted) sound.bark.play();
  //     // });

  //     /**@mechanic move enemy */
  //     // move(enemy);

  //     /**@mechanic bounce enemy off walls */
  //     {
  //       const enemyDistanceFromBottom = distance(enemy)({
  //         x: enemy.x,
  //         y: innerHeight,
  //       });
  //       const enemyDistanceFromTop = enemyDistanceFromBottom - innerHeight;
  //       const enemyDistanceFromRight = distance(enemy)({
  //         x: innerWidth,
  //         y: enemy.y,
  //       });
  //       const enemyDistanceFromLeft = enemyDistanceFromRight - innerWidth;

  //       if (enemyDistanceFromBottom <= enemy.dimension)
  //         enemy.velocity.y = negation(enemy.velocity.y);

  //       if (enemyDistanceFromTop > 0)
  //         enemy.velocity.y = negation(enemy.velocity.y);

  //       if (enemyDistanceFromLeft > 0)
  //         enemy.velocity.x = negation(enemy.velocity.x);

  //       if (enemyDistanceFromRight <= enemy.dimension)
  //         enemy.velocity.x = negation(enemy.velocity.x);
  //     }

  //     /**@mechanic switch sprite l <--> r */
  //     enemy.switchSprite(z);

  //     c.draw(enemy);
  //   },
});

const Sound = (audios) => (sprite) => ({
  ...audios,
  sprite,
});

/**
 *
 * @objects
 *
 */
const c = Canvas(canvasElement)(innerWidth)(innerHeight);

const mouse = Mouse(c);

const score = Score(0)(scoreSprite);

const player = Player(mouse.x)(mouse.y)(50)(blackdogSprite);

const coin = Coin(randomPadX(50))(randomPadY(50))(50)(coinSprite);

const enemies = [...spawnEnemies(3)];

const sound = Sound(audios)(soundSprite);

const objects = {
  c,
  mouse,
  score,
  player,
  coin,
  enemies,
  sound,
};

/**
 *
 * @gamestate
 *
 */
const z = { objects, mechanics, utils };

/**
 *
 * @engine
 *
 */
const Engine = (z) => {
  const {
    objects: { c, player, coin, enemies, mouse, score, sound },
    mechanics: { collider },
    utils: { divideByTwo, distance },
  } = z;

  /**
   *
   * @processing
   *
   */

  /** @player   */
  const moveWMouse = moveW(mouse);
  const zPlayer = compose(moveWMouse)(player);

  /** @coin   */

  const zCoin = { ...coin };

  /** @enemies   */
  const zEnemies = enemies.map(compose(move));

  /** @sound   */
  const zSound = { ...sound };

  /** @score   */
  const zScore = { ...score };

  /** @collisions   */
  const collide = collider(divideByTwo)(distance);
  const playerCollidingWith = collide(player);
  const playerCollidingWithCoin = playerCollidingWith(coin);
  const playerCollidingWithAnEnemy = enemies.some(playerCollidingWith);

  if (playerCollidingWithCoin)
    console.log(playerCollidingWithCoin ? "Player <> Coin" : "");

  if (playerCollidingWithAnEnemy)
    console.log(playerCollidingWithAnEnemy ? "Player <> Enemy" : "");

  /**
   *
   * @ultrastate
   *
   */
  const uz = {
    objects: {
      player: zPlayer,
      coin: zCoin,
      enemies: zEnemies,
      sound: zSound,
      score: zScore,
      mouse,
      c,
    },
    mechanics,
    utils,
  };

  /**
   *
   * @animation
   *
   */
  requestAnimationFrame(() => Engine(uz));
  c.ctx.clearRect(0, 0, c.width, c.height);

  c.draw(zPlayer);
  c.draw(zCoin);
  zEnemies.map(c.draw);
};

/**
 *
 * @effects
 *
 */

const canvasSize = (c) => ((c.width = innerWidth), (c.height = innerHeight));

audios.coin.volume = 0.07;

audios.bark.volume = 1;

// sound.mute(z);

addEventListener("resize", canvasSize);
addEventListener("mousemove", ({ clientX, clientY }) => {
  mouse.x = clientX;
  mouse.y = clientY;
});

addEventListener("click", () => {
  if (sound.bark.muted) {
    sound.sprite.src = "./public/images/soundon.png";
    sound.unmute(z);
    sound.bark.play();
  } else {
    sound.sprite.src = "./public/images/soundoff.png";
    sound.mute(z);
  }
});

/**
 *
 * @start
 *
 */
Engine(z);
