import type * as Party from "partykit/server";
import type { Message, Voice, NewVoiceRequest, VoicesMap } from "./types";
import { callOpenAI } from "./chat";
import crypto from "crypto";

import 'dotenv/config';

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) { }

  // new websocket connection handler
  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
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
    // broadcast it to all the other connections in the room...
    this.party.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id]
    );

    // request a voice to say something, message will be in the form of "voice/UUID"
    if (message.startsWith("voice")) {
      // split string
      const [_, voiceUUID] = message.split("/");
      const stream = await this.handleRequestVoiceResponse(voiceUUID);
      for await (const chunk of stream) {
        sender.send(chunk.choices[0]?.delta?.content || "");
      }
    } else {
      // await this.handleSendMessage(message, sender);
    }
    // const m: Message = {
    //   VoiceUUID: sender.id,
    //   Content: message,
    //   Time: new Date(),
    //   CreatedBy: sender.id,
    // };
    // for await (const chunk of stream) {
    //   sender.send(chunk.choices[0]?.delta?.content || "");
    // }
  }

  // http request handler
  async onRequest(request: Party.Request) {
    if (request.method === "POST") {
      // add a voice
      if (request.url.includes("/voice")) {
        const body: NewVoiceRequest = await request.json();
        if (!body?.name) {
          return new Response("Missing name", { status: 400 });
        }
        if (!body?.description) {
          return new Response("Missing description", { status: 400 });
        }
        const newVoiceUUID = crypto.randomUUID();
        const newVoice: Voice = {
          UUID: newVoiceUUID,
          Name: body.name,
          Description: body.description,
          Messages: [],
        };
        await this.addVoice(newVoice);
        const res = new Response(JSON.stringify(newVoice));
        res.headers.set("Content-Type", "application/json");
        return res;
      }
    }

    if (request.method === "GET") {
      // get all messages
      if (request.url.includes("/messages")) {
        const messages = await this.getMessages();
        const res = new Response(JSON.stringify(messages));
        res.headers.set("Content-Type", "application/json");
        return res;
      }

      // get all voices
      if (request.url.includes("/voices")) {
        const voices = await this.getVoices();
        const res = new Response(JSON.stringify(voices));
        res.headers.set("Content-Type", "application/json");
        return res;
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }

  // getters/setters for storage
  async getVoices() {
    const voices: VoicesMap =
      (await this.party.storage.get<VoicesMap>("voices")) || {};
    return voices;
  }

  async getMessages() {
    const messages: Message[] =
      (await this.party.storage.get<Message[]>("messages")) || [];
    return messages;
  }

  async addVoice(voice: Voice) {
    const voices: VoicesMap =
      (await this.party.storage.get<VoicesMap>("voices")) || {};
    voices[voice.UUID] = voice;
    await this.party.storage.put<VoicesMap>("voices", voices);
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
    return await callOpenAI(voiceUUID, context);
  }

  async createContext(voice: Voice) {
    const voices = await this.getVoices();
    const messages = await this.getMessages();
    let context =
      "The following is a list of fictional characters. Here is a list of their uuids, names and descriptions:\n";
    context += Object.values(voices) + "\n\n";
    context += `Pretend to be one of these characters, and generate a response for ${voice.Name} with description ${voice.Description}:\n`;
    context += "Here is my question:\n";
    return context;
  }

  options: Party.ServerOptions = {
    hibernate: false, // keep the server alive even when there are no connections
  };
}

Server satisfies Party.Worker;
