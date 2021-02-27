export const compose = (...fs) => (x) => fs.reduceRight((v, f) => f(v), x);

export const lazy = (f) => () => f();

export const debug = console.log;

/**
 * @function distance
 * @returns distance between two points
 * @math 𝑑 = √( ( 𝑥2 - 𝑥1 )² + ( 𝑦2 - 𝑦1 )² )
 */
export const distance = ({ x, y }) => ({ x: w, y: z }) =>
  Math.sqrt(Math.pow(w - x, 2) + Math.pow(z - y, 2));

export const randomIntFromRange = (min) => (max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomIntFromRangeWithPad = (range) => (pad) =>
  randomIntFromRange(pad)(range - pad);

export const nonZeroRandomIntFromRange = (min) => (max) => {
  const randomIntFromRange = Math.floor(Math.random() * (max - min + 1) + min);
  return randomIntFromRange === 0
    ? nonZeroRandomIntFromRange(min)(max)
    : randomIntFromRange;
};

export const negation = (n) => -n;

export const avg = (x) => (y) => x + y / 2;

export const divideByTwo = (n) => n / 2;

export const not = (f) => !f();

export const on = (condition) => (f) => (o) => (condition ? f(o) : o);
