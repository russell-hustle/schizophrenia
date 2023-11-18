type VoiceInit = {
  name: string;
  personality: string;
};

type Voice = VoiceInit & {
  id: string;
  assistantId: string;
};

type Message = {
  voice: Voice;
  text: string;
};

interface Message {
  VoiceUUID: string;
  Content: string;
  Time: Date;
  CreatedBy: string;
}

interface VoiceMap {
  [uuid: string]: Voice;
}

interface NewMessageRequest {
  requestedVoiceUUID: string;
}

type SocketEvent = EventVoice | EventMessage;

type EventVoice = EventVoiceAdd | EventVoiceRemove;

type EventVoiceAdd = {
  type: 'VOICE_ADD',
  payload: {
    voice: VoiceInit;
  };
};

type EventVoiceRemove = {
  type: 'VOICE_REMOVE',
  payload: {
    voiceId: string;
  };
};

type EventMessage = EventMessageUser | EventMessageVoice;

type EventMessageUser = {
  type: 'MESSAGE_USER',
  payload: {
    name: string;
    message: string;
  };
};

type EventMessageVoice = {
  type: 'MESSAGE_VOICE',
  payload: {
    voice: Voice;
    message: string;
  };
};