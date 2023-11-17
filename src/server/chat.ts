import OpenAI from "openai";

const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY,
  apiKey: "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",
});

async function postMessage(content: string, previousMessages?: string[]) {
  return await openai.chat.completions.create({
    messages: [{ role: "user", content: content }],
    model: "gpt-3.5-turbo",
    stream: true,
  });
}

export { postMessage };
