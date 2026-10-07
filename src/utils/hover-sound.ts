const createHoverSound = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 0.25;
  audio.preload = "auto";

  return () => {
    audio.currentTime = 0;
    // Browsers block audio until the user's first click/keypress on the page
    audio.play().catch(() => {});
  };
};

/** Task card hover */
export const playHoverSound = createHoverSound("/sounds/hover-sound-1.mp3");

/** Column and task input hover */
export const playHoverSound2 = createHoverSound("/sounds/hover-sound-2.mp3");
