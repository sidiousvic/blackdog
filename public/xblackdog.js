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
  up({ score, enemy }) {
    const enemyArea = Math.pow(enemy.dimension, 2),
      windowArea = innerHeight * innerWidth,
      enemyPercentage = enemyArea / windowArea;
    score.value += enemyPercentage * 1000;
    score.sprite.innerHTML = ~~score.value;
  },
  reset({ score }) {
    score.value = 0;
  },
});

const Player = (x) => (y) => (dimension) => (sprite) => ({
  x,
  y,
  sprite,
  dimension,
  moveWithMouse({ player, mouse }) {
    player.x = mouse.x;
    player.y = mouse.y;
  },
  draw({ player, coin, score, collide, c }) {
    /**@mechanic move player with mouse*/
    player.moveWithMouse(z);

    /**@mechanic increase score when colliding with coin */
    collide(player)(coin)(() => score.up(z));
    c.draw(player);
  },
});

const Coin = (x) => (y) => (dimension) => (sprite) => ({
  x,
  y,
  sprite,
  dimension,
  respawn({ coin, randomIntFromRange }) {
    coin.x = randomIntFromRange(50)(innerWidth - 50);
    coin.y = randomIntFromRange(50)(innerHeight - 50);
  },
  draw({ coin, player, sound, enemies, collide, c }) {
    /**@mechanic play coin sound when colliding with player */
    /**@mechanic respawn coin when colliding with player */
    /**@mechanic spawn new enemy when colliding with player */
    collide(coin)(player)(() => {
      if (!sound.coin.muted) sound.coin.play();
      coin.respawn(z);
      enemies.spawn(z);
    });

    c.draw(coin);
  },
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
  switchSprite({ enemy }) {
    if (enemy.velocity.x < 0) enemy.sprite = enemy.spriteL;
    else enemy.sprite = enemy.spriteR;
  },
  draw({ enemy, player, sound, over, collide, move, c }) {
    /**@mechanic game over when colliding with player */
    /**@mechanic play bark sound when colliding with player */
    collide(enemy)(player)(() => {
      over(z);
      if (!sound.bark.muted) sound.bark.play();
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
    enemy.switchSprite(z);

    c.draw(enemy);
  },
});

const Sound = (audios) => (sprite) => ({
  ...audios,
  sprite,
  mute({ sound }) {
    (sound.bark.muted = true), (sound.coin.muted = true);
  },
  unmute({ sound }) {
    (sound.bark.muted = false), (sound.coin.muted = false);
  },
});
