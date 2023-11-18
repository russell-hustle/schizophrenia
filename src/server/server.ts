import type * as Party from "partykit/server";
import { callOpenAI } from "./chat";
import crypto from "node:crypto";

import openai from "openai";
import { getIntroduction } from "@/utils/entrances";
import { profanityPrompt, voicePrompt } from "@/server/prompts";

const MESSAGE_INTERVAL = 10000;

const RUN_STATUS_CHECK_INTERVAL = 1000;

export default class Server implements Party.Server {
  private thread: openai.Beta.Threads.Thread | null;

  constructor(readonly party: Party.Party) {
    this.thread = null;

    console.log({ party: this.party });

    this.initialize();
  }

  /**
   * JSON.stringify and log
   */
  logJson(...args: any[]) {
    console.log(JSON.stringify(args, null, 2));
  }

  get openaiKey() {
    const apiKey = this.party.env.API_KEY as string;
    return apiKey;
  }

  get openai() {
    return new openai.OpenAI({
      apiKey: this.openaiKey,
    });
  }

  /**
   * Async initialization.
   */
  async initialize() {
    try {
      console.info("creating thread...");
      const ai = this.openai;
      this.thread = await ai.beta.threads.create();

      console.info("thread created", this.thread.id);

      // Begin thread manager loop
      setInterval(() => {
        this.tick();
      }, MESSAGE_INTERVAL);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Every tick we process.
   *
   * TODO: handle @ messages separately
   */
  async tick() {
    console.log("tick");

    if (!this.thread) {
      // Not initialized yet
      console.warn("Can't tick, thread is not initialized!");
      return;
    }

    // Let's choose a random voice
    const voiceMap = await this.getVoices();
    if (!Object.keys(voiceMap).length) {
      return;
    }

    const voices = Object.values(voiceMap);

    const voice = voices[Math.floor(Math.random() * voices.length)];

    const ai = this.openai;
    const thread = this.thread;

    // Let's generate a message
    console.info("Generating message for voice", voice.name);
    const run = await ai.beta.threads.runs.create(
      thread.id,
      {
        assistant_id: voice.assistantId,
        instructions: "Respond to the most recent message with the context of this thread."
      }
    );

    let runResult: openai.Beta.Threads.Runs.Run;

    do {
      // Sleep for a bit
      await new Promise((resolve) => setTimeout(resolve, RUN_STATUS_CHECK_INTERVAL));

      runResult = await ai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );

      // IDK maybe handle other bad status
      console.log({ status: runResult.status });
    } while (runResult.status !== "completed");

    // Retrieve new message
    const messages = await ai.beta.threads.messages.list(
      thread.id
    );

    // This might be some race condition shit or something
    const newMessage = messages.data[0];

    this.logJson("new message", newMessage.content);

    const response = newMessage.content[0];
    if (response.type !== 'text') {
      return;
    }

    this.broadcastMessage({
      message: response.text.value,
      voice: voice,
    });
  }

  async broadcastMessage(payload: EventMessageVoice['payload']) {
    const event: EventMessageVoice = {
      type: 'MESSAGE_VOICE',
      payload,
    };

    const body = JSON.stringify(event);

    console.log({ body });

    this.party.broadcast(body);
  }

  // new websocket connection handler
  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
        id: ${conn.id}
        room: ${this.party.id}
        url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send("hello from server, welcome to the party!");
  }

  // websocket handler
  async onMessage(message: string, sender: Party.Connection) {
    console.log({ message });


    const event = JSON.parse(message) as SocketEvent;

    console.info({ event });

    switch (event.type) {
      case "VOICE_ADD":
        this.addVoice(event.payload.voice);
        break;
      case "VOICE_REMOVE":
      case "MESSAGE_USER":
      case "MESSAGE_VOICE":
    }
  }

  // http request handler
  async onRequest(request: Party.Request) {



    const headers = new Headers({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    if (request.method === "OPTIONS") {
      return new Response(null, { headers, status: 204 });
    }

    if (request.method === "POST") {
      // add a voice
      if (request.url.includes("/voice")) {
        const body: VoiceInit = await request.json();
        if (!body?.name) {
          return new Response("Missing name", { headers, status: 400 });
        }
        if (!body?.personality) {
          return new Response("Missing personality", { status: 400 });
        }
        const newVoice: VoiceInit = {
          name: body.name,
          personality: body.personality,
        };
        await this.addVoice(newVoice);
        const res = new Response(JSON.stringify(newVoice), { headers });
        return res;
      }
    }

    if (request.method === "GET") {
      // get all messages
      if (request.url.includes("/messages")) {
        const messages = await this.getMessages();
        const res = new Response(JSON.stringify(messages), { headers });
        return res;
      }

      // get all voices
      if (request.url.includes("/voices")) {
        const voices = await this.getVoices();
        const res = new Response(JSON.stringify(voices), { headers });
        return res;
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }

  // getters/setters for storage
  async getVoices() {
    const voices: VoiceMap =
      (await this.party.storage.get<VoiceMap>("voices")) || {};
    return voices;
  }

  async getMessages() {
    const messages: Message[] =
      (await this.party.storage.get<Message[]>("messages")) || [];
    return messages;
  }

  async addVoice(voiceInit: VoiceInit) {
    console.info("Adding voice", voiceInit);

    const thread = this.thread;

    if (!thread) {
      console.warn("Can't add voice, thread is not initialized!");
      return;
    }

    const ai = this.openai;

    const assistant = await ai.beta.assistants.create({
      instructions:
        `${voicePrompt}Your name is ${voiceInit.name}. Your personality is ${voiceInit.personality}. ${profanityPrompt}`,
      name: voiceInit.name,
      model: "gpt-3.5-turbo",
    });

    const newVoiceUUID = crypto.randomUUID();

    const fullVoice: Voice = {
      id: newVoiceUUID,
      ...voiceInit,
      assistantId: assistant.id,
    };

    const introMessage = getIntroduction(voiceInit.name);

    await ai.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content: introMessage,
      }
    );

    this.broadcastMessage({
      message: introMessage,
      voice: fullVoice,
    });

    const voices: VoiceMap =
      (await this.party.storage.get<VoiceMap>("voices")) || {};
    voices[fullVoice.id] = fullVoice;
    await this.party.storage.put<VoiceMap>("voices", voices);
  }

  async addMessage(message: Message) {
    const messages: Message[] =
      (await this.party.storage.get<Message[]>("messages")) || [];
    messages.push(message);
    await this.party.storage.put<Message[]>("messages", messages);
  }

  async handleRequestVoiceResponse(voiceUUID: string): Promise<any> {
    const voices = await this.getVoices();
    const voice = voices[voiceUUID];
    if (!voice) {
      return;
    }
    const context = await this.createContext(voice);
    const apiKey = this.party.env.API_KEY as string;
    return await callOpenAI(apiKey, voiceUUID, context);
  }

  async createContext(voice: Voice) {
    const voices = await this.getVoices();
    const messages = await this.getMessages();
    let context =
      "The following is a list of fictional characters. Here is a list of their uuids, names and descriptions:\n";
    context += Object.values(voices) + "\n\n";
    context += `Pretend to be one of these characters, and generate a response for ${voice.name} with personality ${voice.personality}:\n`;
    context += "Here is my question:\n";
    return context;
  }

  options: Party.ServerOptions = {
    hibernate: false, // keep the server alive even when there are no connections
  };
}

Server satisfies Party.Worker;
