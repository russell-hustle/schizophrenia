import OpenAI from "openai";

const openai = new OpenAI({
  // apiKey: it goes here bro,
});

async function callOpenAI(message: string, conversationContext: string) {
  console.log("message", message);
  return await openai.chat.completions.create({
    messages: [{ role: "user", content: conversationContext }],
    model: "gpt-3.5-turbo",
    stream: true,
  });
}

export { callOpenAI };
