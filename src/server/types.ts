export interface Message {
  VoiceUUID: string;
  Content: string;
  Time: Date;
  CreatedBy: string;
}

export interface Voice {
  UUID: string;
  Name: string;
  Description: string;
  Messages: Message[];
}

export interface VoicesMap {
  [uuid: string]: Voice;
}

export interface NewVoiceRequest {
  name: string;
  description: string;
}

export interface NewMessageRequest {
  requestedVoiceUUID: string;
}
