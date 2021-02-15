/*
 *
 * utilities
 *
 */
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

/**
 * @function distance
 * @returns distance between two points
 * @math 𝑑 = √( ( 𝑥2 - 𝑥1 )² + ( 𝑦2 - 𝑦1 )² )
 */
const distance = ({ x, y }) => ({ x: w, y: z }) =>
  Math.sqrt(Math.pow(w - x, 2) + Math.pow(z - y, 2));

const randomIntFromRange = (min) => (max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const negation = (n) => -n;

const avg = (x) => (y) => x + y / 2;

const divideByTwo = (n) => n / 2;

/*
 *
 * objects
 *
 */
const Player = (x) => (y) => (dimension) => ({
  x,
  y,
  sprite: document.getElementById("blackdog"),
  dimension,
  moveWithMouse(mouse) {
    const player = this;
    player.x = mouse.x;
    player.y = mouse.y;
    return player;
  },
  draw(s) {
    const { player, coin, score, mouse, collide, c } = s;

    /**@mechanic move player with mouse*/
    player.moveWithMouse(mouse);

    /**@mechanic increase score when colliding with coin */
    collide(player)(coin)(() => score.up());

    c.draw(player);
  },
});

const Coin = (x) => (y) => (dimension) => ({
  x,
  y,
  sprite: document.getElementById("coin"),
  dimension,
  respawn() {
    const coin = this;
    const randomCoinX = randomIntFromRange(50)(innerWidth - 50);
    const randomCoinY = randomIntFromRange(50)(innerHeight - 50);
    coin.x = randomCoinX;
    coin.y = randomCoinY;
  },
  draw(s) {
    const { coin, player, sound, enemies, collide, c } = s;

    /**@mechanic play coin sound when colliding with player */
    /**@mechanic respawn coin when colliding with player */
    /**@mechanic spawn new enemy when colliding with player */
    collide(coin)(player)(() => {
      sound.coin.play();
      coin.respawn();
      enemies.spawn();
    });

    c.draw(coin);
  },
});

const Enemy = (x) => (y) => (dimension) => (speed) => ({
  x,
  y,
  sprite: document.getElementById("enemy"),
  spriteR: document.getElementById("enemyR"),
  spriteL: document.getElementById("enemy"),
  dimension,
  velocity: {
    x: speed,
    y: speed,
  },

  draw(s) {
    const { enemy, player, sound, over, collide, move, c } = s;

    /**@mechanic game over when colliding with player */
    /**@mechanic play bark sound when colliding with player */
    collide(enemy)(player)(() => {
      over(s);
      sound.bark.play();
    });

    /**@mechanic move enemy */
    move(enemy);

    /**@mechanic bounce enemy off walls */
    {
      const enemyDistanceFromBottom = distance(enemy)({
        x: enemy.x,
        y: innerHeight,
      });
      const enemyDistanceFromTop = enemyDistanceFromBottom - innerHeight;
      const enemyDistanceFromRight = distance(enemy)({
        x: innerWidth,
        y: enemy.y,
      });
      const enemyDistanceFromLeft = enemyDistanceFromRight - innerWidth;

      if (enemyDistanceFromBottom <= enemy.dimension)
        enemy.velocity.y = negation(enemy.velocity.y);

      if (enemyDistanceFromTop > 0)
        enemy.velocity.y = negation(enemy.velocity.y);

      if (enemyDistanceFromLeft > 0)
        enemy.velocity.x = negation(enemy.velocity.x);

      if (enemyDistanceFromRight <= enemy.dimension)
        enemy.velocity.x = negation(enemy.velocity.x);
    }

    /**@mechanic switch sprite l <--> r */
    {
      if (enemy.velocity.x < 0) enemy.sprite = enemy.spriteL;
      else enemy.sprite = enemy.spriteR;
    }

    c.draw(enemy);
  },
});

const Score = (value) => ({
  value,
  sprite: document.getElementById("score"),
  up() {
    const score = this,
      enemyArea = 50 * 50,
      windowArea = innerHeight * innerWidth,
      enemyPercentage = enemyArea / windowArea;
    score.value += enemyPercentage * 1000;
    score.sprite.innerHTML = ~~score.value;
  },
  reset() {
    let score = this;
    score.value = 0;
  },
});

const Sound = () => ({
  coin: new Audio("../audio/coin.wav"),
  bark: new Audio("../audio/bark.wav"),
  sprite: document.getElementById("sound"),
  mute() {
    const sound = this;
    (sound.bark.muted = true), (sound.coin.muted = true);
  },
  unmute() {
    const sound = this;
    (sound.bark.muted = false), (sound.coin.muted = false);
  },
  reset() {
    let score = this;
    score.value = 0;
  },
});

const Mouse = (c) => ({
  x: c.width / 2,
  y: c.width / 2,
  xy({ clientX, clientY }) {
    const mouse = this;
    mouse.x = clientX;
    mouse.y = clientY;
  },
});

/*
 *
 * engine
 *
 */
const game = (s) => {
  const { player, coin, enemies, c } = s;

  requestAnimationFrame(() => game(s));
  c.ctx.clearRect(0, 0, c.width, c.height);

  player.draw(s);
  coin.draw(s);
  enemies.map((enemy) => ((s.enemy = enemy), enemy.draw(s)));
};

const launch = () => {
  /**@mechanic initialize canvas context*/
  const c = document.querySelector("canvas");
  c.ctx = c.getContext("2d");
  c.draw = ({ sprite, x, y, dimension }) =>
    c.ctx.drawImage(sprite, x, y, dimension, dimension);
  c.width = innerWidth;
  c.height = innerHeight;
  const canvasSize = () => {
    (c.width = innerWidth), (c.height = innerHeight);
  };
  addEventListener("resize", canvasSize);

  /**@mechanic calculate mouse*/
  const mouse = Mouse(c);
  addEventListener("mousemove", ({ clientX, clientY }) =>
    mouse.xy({ clientX, clientY })
  );

  /**@mechanic create score*/
  const score = Score(0);

  /**@mechanic create player*/
  const player = Player(mouse.x)(mouse.y)(50);

  /**@mechanic create coin*/
  const randomCoinX = randomIntFromRange(50)(innerWidth - 50);
  const randomCoinY = randomIntFromRange(50)(innerHeight - 50);
  const coin = Coin(randomCoinX)(randomCoinY)(50);

  /**@mechanic create enemies */
  const enemies = [];
  enemies.spawn = () => {
    const randomX = randomIntFromRange(50)(innerWidth - 50);
    const randomY = randomIntFromRange(50)(innerHeight - 50);
    const randomSpeed = randomIntFromRange(-5)(4); // -5 -4 -3 -2 -1 0 1 2 3 4
    const spawnedEnemy = Enemy(randomX)(randomY)(35)(
      randomSpeed === 0 ? 5 : randomSpeed // -5 -4 -3 -2 -1 5 1 2 3 4
    );
    enemies.push(spawnedEnemy);
  };
  enemies.spawn();

  /**@mechanic initialize sounds */
  const sound = Sound();
  sound.bark.volume = 1;
  sound.coin.volume = 0.07;
  sound.mute();
  addEventListener("click", () => {
    if (sound.bark.muted) {
      sound.sprite.src = "/images/soundon.png";
      sound.unmute();
      sound.bark.play();
    } else {
      sound.sprite.src = "/images/soundoff.png";
      sound.mute();
    }
  });

  /**@mechanic handle colissions */
  const collide = (a) => (b) => (f) => {
    const hitboxA = divideByTwo(a.dimension);
    const distanceAToB = distance(a)(b);
    distanceAToB <= hitboxA && f();
  };

  /**@mechanic move object */
  const move = (o) => ((o.x += o.velocity.x), (o.y += o.velocity.y));

  /**@gamestate */
  const s = {
    c,
    player,
    coin,
    enemies,
    score,
    sound,
    mouse,
    collide,
    move,
    over,
  };
  return s;
};

const over = ({ coin, enemies, score }) => {
  coin.respawn();
  score.reset();
  enemies.length = 0;
};

const s = launch();
game(s);
