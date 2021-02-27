export const Canvas = (c) => (w) => (h) => {
  c.ctx = c.getContext("2d");
  c.draw = ({ sprite, x, y, dimension }) =>
    c.ctx.drawImage(sprite, x, y, dimension, dimension);
  c.width = w;
  c.height = h;
  return c;
};

export const Mouse = (c) => ({
  x: c.width / 2,
  y: c.width / 2,
});

export const Score = (value) => (sprite) => ({
  value,
  sprite,
});

export const Player = (x) => (y) => (dimension) => (sprite) => ({
  tag: "player",
  x,
  y,
  sprite,
  dimension,
  colliding: [],
});

export const Coin = (x) => (y) => (dimension) => (sprite) => ({
  tag: "coin",
  x,
  y,
  sprite,
  dimension,
  colliding: [],
});

export const Enemy = (x) => (y) => (dimension) => (sprites) => (speed) => ({
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

export const Sound = (audios) => (sprite) => ({
  ...audios,
  sprite,
});
