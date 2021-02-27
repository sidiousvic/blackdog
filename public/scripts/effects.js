import { audios } from "./elements.js";
import { mouse } from "./objects.js";

const canvasSize = (c) => ((c.width = innerWidth), (c.height = innerHeight));
addEventListener("resize", canvasSize);

addEventListener("mousemove", ({ clientX, clientY }) => {
  mouse.x = clientX;
  mouse.y = clientY;
});

audios.coin.volume = 0.07;
audios.bark.volume = 1;
// sound.mute(z);
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
