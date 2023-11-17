import type * as Party from "partykit/server";
import type { Message } from "./types";
import { postMessage } from "./chat";

export default class Server implements Party.Server {
  messages: Message[] = [];
  constructor(readonly party: Party.Party) {}

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
    const m: Message = {
      VoiceUUID: "123",
      Content: message,
      Time: new Date(),
      CreatedBy: sender.id,
    };
    this.messages.push(m);
    const stream = await postMessage(message);
    for await (const chunk of stream) {
      sender.send(chunk.choices[0]?.delta?.content || "");
    }
  }

  // http request handler
  async onRequest(request: Party.Request) {
    if (request.method === "POST") {
      const payload = await request.json<{ message: string }>();
      console.log(payload);
      return new Response("OK");
    }

    if (request.method === "GET") {
      // get all messages
      if (request.url.includes("/messages")) {
        const res = new Response(JSON.stringify(this.messages));
        res.headers.set("Content-Type", "application/json");
        return res;
      }

      return new Response(JSON.stringify("not implemented"));
    }

    return new Response("Method not allowed", { status: 405 });
  }
}

Server satisfies Party.Worker;
