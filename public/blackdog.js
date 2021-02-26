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
 * @elements
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
const elements = {
  canvasElement,
  scoreSprite,
  blackdogSprite,
  coinSprite,
  enemySprites,
  audios,
  soundSprite,
  randomPad50X,
  randomPad50Y,
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

const models = {
  Canvas,
  Mouse,
  Score,
  Player,
  Coin,
  Enemy,
};

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
  return colliding
    ? { ...a, colliding: [...a.colliding.filter((c) => b.tag !== c.tag), b] }
    : { ...a, colliding: [...a.colliding.filter((c) => b.tag !== c.tag)] };
};
const colliding = (o) => o.colliding.length;
const areColliding = (adversary) => (o) =>
  o.colliding.some((c) => c.tag === adversary.tag);
const onCollision = (f) => (adversary) => (o) =>
  o.colliding.some((c) => c.tag === adversary.tag) ? f(o) : o;
const move = (o) => ({ ...o, x: o.x + o.velocity.x, y: o.y + o.velocity.y });
const respawner = (lazyX) => (lazyY) => (o) => ({
  ...o,
  x: lazyX(),
  y: lazyY(),
});
const respawn = respawner(randomPad50X)(randomPad50Y);

const spawn = (o) => (objects) => [...objects, o];

const gameover = (z) => {
  const { objects } = z;
  const noEnemies = [];
  oz = { ...z, objects: { ...objects, enemies: noEnemies } };
  return oz;
};
const moveW = (mover) => (o) => ({ ...o, x: mover.x, y: mover.y });

const mechanics = {
  collider,
  move,
  gameover,
  moveW,
  respawn,
  areColliding,
  onCollision,
  colliding,
  spawn,
};

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

const enemies = [];

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
const z = { utils, mechanics, models, objects, elements };

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
    mechanics: {
      collider,
      respawn,
      onCollision,
      areColliding,
      colliding,
      gameover,
      spawn,
    },
    elements: { enemySprites, randomPad50X, randomPad50Y },
    utils: { divideByTwo, distance, nonZeroRandomIntFromRange, on },
  } = z;
  /**
   *
   * @collisions
   *
   */

  /** @player   */

  const moveWMouse = moveW(mouse);
  const zPlayer = compose(moveWMouse)(player);

  /** @coin   */
  const collideWithPlayer = collider(divideByTwo)(distance)(player);
  const respawnOnCollisionWith = onCollision(respawn);

  const zCoin = compose(
    respawnOnCollisionWith(player),
    collideWithPlayer
  )(coin);

  /** @enemies   */
  const moveAll = (objects) => objects.map(move);
  const collideAllWithPlayer = (objects) => objects.map(collideWithPlayer);

  const newEnemy = Enemy(randomPad50X())(randomPad50Y())(40)(enemySprites)(
    nonZeroRandomIntFromRange(-5)(5)
  );
  const spawnEnemy = spawn(newEnemy);
  const playerAndCoinColliding = areColliding(zPlayer)(zCoin);

  onPlayerAndCoinColliding = on(playerAndCoinColliding);

  const zEnemies = compose(
    onPlayerAndCoinColliding(spawnEnemy),
    collideAllWithPlayer,
    moveAll
  )(enemies);

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
    models,
    elements,
  };

  /**
   *
   * @gameover
   *
   */

  const collidingWithEnemy = enemies.some(colliding);
  if (collidingWithEnemy)
    return requestAnimationFrame(() => Engine(gameover(uz)));
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
