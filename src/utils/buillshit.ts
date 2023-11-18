import PartySocket from "partysocket";

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

    this.conn.onmessage = e => {
      try {
        const event = JSON.parse(e.data) as SocketEvent;
        console.log(event);
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

  sendMessage(message: EventMessageUser) {

  }
}