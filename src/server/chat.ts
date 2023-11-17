import OpenAI from "openai";



async function callOpenAI(key: string, message: string, conversationContext: string) {
  const openai = new OpenAI({
    apiKey: key,
  });

  console.log({ key });
  console.log("message", message);
  return await openai.chat.completions.create({
    messages: [{ role: "user", content: conversationContext }],
    model: "gpt-3.5-turbo",
    stream: true,
  });
}

export { callOpenAI };
