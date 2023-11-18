import PartySocket from "partysocket";

const PARTYKIT_HOST = "localhost:1999";
const BASE_URL = "http://localhost:1999";

const conn = new PartySocket({
  host: PARTYKIT_HOST,
  room: "my-room",
});

conn.addEventListener;

type Props = {
  host: string;
  room: string;
  onMessage: (message: Message) => void;
};

export class Fuck {
  conn: PartySocket;

  constructor({ host, room, onMessage }: Props) {
    this.conn = new PartySocket({
      host,
      room,
    });

    conn.onmessage = e => {
      try {
        const event = JSON.parse(e.data) as SocketEvent;
        switch (event.type) {
          case 'MESSAGE_VOICE':
            onMessage({
              voice: event.payload.voice,
              text: event.payload.message
            });
            break;

          default:
            break;
        }
      } catch (error) {
        console.error(error);
      }
    };
  }

  handleMessage() {

  }

  sendMessage(message: EventMessageUser) {

  }
}