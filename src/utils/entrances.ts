const entrances = [
  "Prepare for a new perspective! %NAME% has stepped into your mind.",
  "A fresh voice echoes in your thoughts. Welcome, %NAME%!",
  "Mind the gap! %NAME% just entered your cerebral realm.",
  "Heads up! %NAME% is now part of your inner dialogue.",
  "Unlocking new neural connections! Say hello to %NAME%.",
  "Venturing into the mind maze—%NAME% has arrived!",
  "New thought patterns detected! Welcome, %NAME%.",
  "Your mental symphony just got a new note. Hello, %NAME%!",
  "Breaking through the mental barrier: %NAME% is here!",
  "The inner sanctum expands with %NAME%'s arrival.",
  "A doorway to your thoughts swings open—%NAME% walks in.",
  "Buckle up! %NAME% just crossed the threshold of your consciousness.",
  "Welcome the newest mind traveler, %NAME%, to your mental space.",
  "Step by step, thought by thought, %NAME% enters your headspace.",
  "A new echo in your mind's chamber—%NAME% has arrived.",
];

export const getIntroduction = (name: string) => {
  const randomEntrance = entrances[Math.floor(Math.random() * entrances.length)];

  return randomEntrance.replace("%NAME%", name);
};