// hoverSound.js
export const hoverSound = new Audio("/public/sounds/hover-sound-1.mp3");

hoverSound.volume = 0.25;
hoverSound.preload = "auto";

export const playHoverSound = () => {
  hoverSound.currentTime = 0;
  hoverSound.play().catch((err) => {
    console.log("err", err);
  });
};
