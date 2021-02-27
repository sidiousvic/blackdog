import {
  canvasElement,
  scoreSprite,
  blackdogSprite,
  coinSprite,
  randomPad50X,
  randomPad50Y,
  soundSprite,
  audios,
} from "./elements.js";
import { Canvas, Mouse, Score, Player, Coin, Sound } from "./models.js";

export const c = Canvas(canvasElement)(innerWidth)(innerHeight);

export const mouse = Mouse(c);

export const score = Score(0)(scoreSprite);

export const player = Player(mouse.x)(mouse.y)(50)(blackdogSprite);

export const coin = Coin(randomPad50X())(randomPad50Y())(50)(coinSprite);

export const enemies = [];

export const sound = Sound(audios)(soundSprite);
