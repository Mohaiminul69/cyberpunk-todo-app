// hoverSound.js
export const hoverSound2 = new Audio("/public/sounds/hover-sound-2.mp3");

hoverSound2.volume = 0.25;
hoverSound2.preload = "auto";

export const playHoverSound2 = () => {
  hoverSound2.currentTime = 0;
  hoverSound2.play().catch((err) => {
    console.log("err", err);
  });
};
