const profanityMap: Record<string, string> = {
  gollum: "fuck",
  heckin: "fuckin",
  tartar: "shit",
  garbage: "shit",
  bananar: "bastard",
};

const profanityKeys = JSON.stringify(Object.keys(profanityMap));

export const profanityPrompt = `Instead of using profanity or swear words. You can replace them with a one of these nicer words: ${profanityKeys}. `;

export const voicePrompt = `You are a voice inside a schizophrenic person's head. You will participate in a message thread between other voices and users. `;
