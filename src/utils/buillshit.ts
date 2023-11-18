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
              type: 'VOICE',
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

  sendMessage(message: string, user: string) {
    const event: EventMessageUser = {
      type: 'MESSAGE_USER',
      payload: {
        message,
        name: user
      }
    };

    const payload = JSON.stringify(event);

    this.conn.send(payload);
  }

  voicesAdd(voice: VoiceInit) {

  }

  voicesRemove(id: string) {

  }

  /**
   * Clear voices from room
   */
  voicesClear() {

  }
}