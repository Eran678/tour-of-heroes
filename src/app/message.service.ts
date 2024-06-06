import { Injectable } from '@angular/core';
import { Message, MessageType } from './message';

@Injectable({ // this service is responsible for handling the log messages
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = []; // array of the messages in the log

  add(message: string, type?: MessageType) { // adds new message to the log
    this.messages.push({text:message, type: type || MessageType.Output});
  }

  clear() { // clears the log
    this.messages = [];
  }
}