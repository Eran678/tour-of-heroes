import { Component, Input } from '@angular/core';
import { Hero } from '../hero';
import { MAX_ABILITIES } from '../add-hero-panel/add-hero-panel.component';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../message.service';
import { MessageType } from '../message';

@Component({ // this component is responsible for handling the 'edit hero' form
  standalone: true,
  selector: 'app-edit-hero-panel',
  templateUrl: './edit-hero-panel.component.html',
  styleUrls: ['./edit-hero-panel.component.scss'],
  imports: [NgFor, FormsModule]
})
export class EditHeroPanelComponent {
  @Input() hero!: Hero; // hero that's being edited
  @Input() close!: () => void; // function called when pressing 'x' button
  @Input() openDraw!: () => void; // function called when pressing 'draw' button

  constructor(private messageService: MessageService) {}

  removeAbility(index: number): void { // removes ability at index from the list ('-' button)
    if (this.hero.abilities.length > 1)
      this.hero.abilities.splice(index, 1);
  }

  addAbility(): void { // adds new ability at end of list ('+' button)
    if (this.hero.abilities.length < MAX_ABILITIES)
      this.hero.abilities.push("");
  }

  trackByIndex(index: number, item: any): number { // tracks focused textbox so you don't lose focus when writing
    return index;
  }

  onUploadImage = (event: Event) => { // function called when pressing 'upload image' button (saves image in hero as blob)
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length == 0) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')){
      this.messageService.add("EditHeroComponent: File isn't an image", MessageType.Error);
      alert("Invalid file type! File should be an image!");
      return;
    }

    // save image as blob
    const reader = new FileReader();
    reader.readAsArrayBuffer(file); // read the image file as ArrayBuffer
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      if (arrayBuffer && this.hero) {
        const blob = new Blob([arrayBuffer], { type: file.type }); // create a blob
        this.hero.image = blob;
        this.hero.isImageDrawn = false;
        this.messageService.add("EditHeroComponent: Image uploaded successfully");
      }
      else {
        this.messageService.add("EditHeroComponent: Error reading image file", MessageType.Error);
      }
    };
  }
}
