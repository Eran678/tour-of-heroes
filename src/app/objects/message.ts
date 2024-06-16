export interface Message {
    text: string;
    type: MessageType;
  }

export enum MessageType {
  Output, Info, Warning, Error
}