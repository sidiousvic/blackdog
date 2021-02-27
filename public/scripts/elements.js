import { lazy, randomIntFromRangeWithPad } from "./utils.js";

export const canvasElement = document.querySelector("canvas");
export const scoreSprite = document.getElementById("score");
export const blackdogSprite = document.getElementById("blackdog");
export const coinSprite = document.getElementById("coin");
export const enemySprites = {
  R: document.getElementById("enemyR"),
  L: document.getElementById("enemy"),
};
export const audios = {
  coin: new Audio("./public/audio/coin.wav"),
  bark: new Audio("./public/audio/bark.wav"),
};
export const soundSprite = document.getElementById("sound");

export const randomPad50X = lazy(() =>
  randomIntFromRangeWithPad(innerWidth)(50)
);
export const randomPad50Y = lazy(() =>
  randomIntFromRangeWithPad(innerHeight)(50)
);
