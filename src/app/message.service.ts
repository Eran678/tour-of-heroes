import { Injectable } from '@angular/core';
import { Message, MessageType } from './message';
import { Observable, Subject } from 'rxjs';

@Injectable({ // this service is responsible for handling the log messages
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = []; // array of the messages in the log
  private clickedMessage: Subject<string> = new Subject<string>();

  add(message: string, type?: MessageType) { // adds new message to the log
    this.messages.push({text:message, type: type ?? MessageType.Output});
  }

  clear() { // clears the log
    this.messages = [];
  }

  getClickedMessage(): Observable<string> {
    return this.clickedMessage;
  }

  setClickedMessage(text: string) {
    this.clickedMessage.next(text);
  }
}