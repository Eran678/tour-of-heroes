import { Component } from '@angular/core';
import { MessageService } from '../message.service';
import { MessageType } from '../message';

@Component({ // this component is responsible for handling the messages panel
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
  isOpen: boolean = true; // whether the messages panel is open or minimized

  MESSAGE_COLORS = {
    [MessageType.Output] : "#ffffff",
    [MessageType.Info] : "#92e2ff",
    [MessageType.Warning] : "#ffff00",
    [MessageType.Error] : "#ff0000"
  }

  constructor(public messageService: MessageService) {}

  togglePanel(): void { // function called when pressing '▼' button (minimizes messages panel)
    this.isOpen = !this.isOpen;
  }
}