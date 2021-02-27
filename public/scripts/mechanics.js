import { randomPad50X, randomPad50Y } from "./elements.js";

export const collider = (divideByTwo) => (distance) => (b) => (a) => {
  const hitboxA = divideByTwo(a.dimension);
  const hitboxB = divideByTwo(b.dimension);
  const distanceAToB = distance(a)(b);
  const colliding = distanceAToB <= hitboxA + hitboxB;
  return colliding
    ? { ...a, colliding: [...a.colliding.filter((c) => b.tag !== c.tag), b] }
    : { ...a, colliding: [...a.colliding.filter((c) => b.tag !== c.tag)] };
};
export const colliding = (o) => o.colliding.length;
export const areColliding = (adversary) => (o) =>
  o.colliding.some((c) => c.tag === adversary.tag);
export const onCollision = (f) => (adversary) => (o) =>
  o.colliding.some((c) => c.tag === adversary.tag) ? f(o) : o;
export const move = (o) => ({
  ...o,
  x: o.x + o.velocity.x,
  y: o.y + o.velocity.y,
});
export const respawner = (lazyX) => (lazyY) => (o) => ({
  ...o,
  x: lazyX(),
  y: lazyY(),
});
export const respawn = respawner(randomPad50X)(randomPad50Y);

export const spawn = (o) => (objects) => [...objects, o];

export const gameover = (z) => {
  const { objects } = z;
  const noEnemies = [];
  oz = { ...z, objects: { ...objects, enemies: noEnemies } };
  return oz;
};
export const moveW = (mover) => (o) => ({ ...o, x: mover.x, y: mover.y });
