export const engine = (z) => {
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
      move,
      moveW,
    },
    elements: { enemySprites, randomPad50X, randomPad50Y },
    models: { Enemy },
    utils: { divideByTwo, distance, nonZeroRandomIntFromRange, on, compose },
  } = z;

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

  const onPlayerAndCoinColliding = on(playerAndCoinColliding);

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
    ...z,
  };

  /**
   *
   * @gameover
   *
   */
  const collidingWithEnemy = enemies.some(colliding);
  if (collidingWithEnemy)
    return requestAnimationFrame(() => engine(gameover(uz)));

  /**
   *
   * @animation
   *
   */
  requestAnimationFrame(() => engine(uz));
  c.ctx.clearRect(0, 0, c.width, c.height);

  c.draw(zPlayer);
  c.draw(zCoin);
  zEnemies.map(c.draw);
};
