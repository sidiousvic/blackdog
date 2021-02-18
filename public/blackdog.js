/**
 *
 * @utils
 *
 */
const compose = (...fs) => (x) => fs.reduceRight((v, f) => f(v), x);
const lazy = (f) => () => f();
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
const on = (condition) => (f) => (o) => (condition ? f(o) : o);

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
  on,
};

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
const randomPad50X = lazy(() => randomIntFromRangeWithPad(innerWidth)(50));
const randomPad50Y = lazy(() => randomIntFromRangeWithPad(innerHeight)(50));

/**
 *
 * @mechanics
 *
 */
/**
 * @function collider
 * @returns an object and its colliding adversaries
 */
const collider = (divideByTwo) => (distance) => (b) => (a) => {
  const hitboxA = divideByTwo(a.dimension);
  const hitboxB = divideByTwo(b.dimension);
  const distanceAToB = distance(a)(b);
  const colliding = distanceAToB <= hitboxA + hitboxB;
  return colliding
    ? { ...a, colliding: [...a.colliding.filter((c) => b.tag !== c.tag), b] }
    : { ...a, colliding: [...a.colliding.filter((c) => b.tag !== c.tag)] };
};
const move = (o) => ({ ...o, x: o.x + o.velocity.x, y: o.y + o.velocity.y });
const respawner = (randomPad50X) => (randomPad50Y) => (o) => ({
  ...o,
  x: randomPad50X(),
  y: randomPad50Y(),
});
const respawn = respawner(randomPad50X)(randomPad50Y);
const over = (z) => {
  // game over
};
const moveW = (mover) => (o) => ({ ...o, x: mover.x, y: mover.y });

const mechanics = {
  collider,
  move,
  over,
  moveW,
  respawn,
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
});

const Player = (x) => (y) => (dimension) => (sprite) => ({
  tag: "player",
  x,
  y,
  sprite,
  dimension,
  colliding: [],
});

const Coin = (x) => (y) => (dimension) => (sprite) => ({
  tag: "coin",
  x,
  y,
  sprite,
  dimension,
  colliding: [],
});

const Enemy = (x) => (y) => (dimension) => (sprites) => (speed) => ({
  tag: "enemy",
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
  colliding: [],
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

const coin = Coin(randomPad50X())(randomPad50Y())(50)(coinSprite);

const spawnEnemy = lazy(() =>
  Enemy(randomPad50X())(randomPad50Y())(40)(enemySprites)(
    nonZeroRandomIntFromRange(-5)(5)
  )
);

const enemies = [spawnEnemy(), spawnEnemy(), spawnEnemy()];

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
const z = { utils, mechanics, objects };

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
 * @engine
 *
 */
const Engine = (z) => {
  const {
    objects: { c, player, coin, enemies, mouse, score, sound },
    mechanics: { collider, respawn },
    utils: { divideByTwo, distance },
  } = z;

  /**
   *
   * @processing
   *
   */

  /**
   *
   * @collisions
   *
   */

  /** @player   */

  const moveWMouse = moveW(mouse);
  const zPlayer = compose(moveWMouse)(player);

  /** @coin   */
  const collide = collider(divideByTwo)(distance);
  const collideWithPlayer = collide(player);

  const onCollisionWith = (adversary) => (f) => (o) =>
    o.colliding.some((c) => c.tag === adversary.tag) ? f(o) : o;

  const onCollisionWithPlayer = onCollisionWith(player);

  const zCoin = compose(
    onCollisionWithPlayer(respawn),
    collideWithPlayer
  )(coin);
  /** @enemies   */

  const zEnemies = enemies.map(compose(move));

  /** @sound   */
  const zSound = { ...sound };

  /** @score   */
  const zScore = { ...score };

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
 * @start
 *
 */
Engine(z);
