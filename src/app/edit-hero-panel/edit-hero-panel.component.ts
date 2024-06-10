import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { MAX_ABILITIES } from '../add-hero-panel/add-hero-panel.component';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../message.service';
import { MessageType } from '../message';
import { HeroService } from '../hero.service';

@Component({ // this component is responsible for handling the 'edit hero' form
  standalone: true,
  selector: 'app-edit-hero-panel',
  templateUrl: './edit-hero-panel.component.html',
  styleUrls: ['./edit-hero-panel.component.scss'],
  imports: [NgFor, FormsModule]
})
export class EditHeroPanelComponent implements OnInit {
  @Input() heroId!: number; // hero that's being edited
  @Output() close = new EventEmitter();
  @Output() upload = new EventEmitter<File>();
  @Output() openDraw = new EventEmitter();

  heroName: string = "";
  heroAbilities: string[] = [];

  constructor(private heroService: HeroService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getName();
    this.getAbilities();
  }

  getName() {
    this.heroService.getName(this.heroId).subscribe(name => {
      this.heroName = name ?? "";
    });
  }

  getAbilities() {
    this.heroService.getAbilities(this.heroId).subscribe(abilities => {
      this.heroAbilities = abilities ?? [];
    });
  }

  removeAbility(index: number): void { // removes ability at index from the list ('-' button)
    if (this.heroAbilities.length > 1)
      this.heroAbilities.splice(index, 1);
  }

  addAbility(): void { // adds new ability at end of list ('+' button)
    if (this.heroAbilities.length < MAX_ABILITIES)
      this.heroAbilities.push("");
  }

  trackByIndex(index: number, item: any): number { // tracks focused textbox so you don't lose focus when writing
    return index;
  }

  onUploadImage(event: Event) {
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
      if (arrayBuffer && this.heroId) {
        const blob = new Blob([arrayBuffer], { type: file.type }); // create a blob
        this.heroService.updateImage(this.heroId, blob, false);
        this.messageService.add("EditHeroComponent: Image uploaded successfully");
      }
      else {
        this.messageService.add("EditHeroComponent: Error reading image file", MessageType.Error);
      }
    };

    this.upload.emit(file);
  }

  saveChanges() {
    this.heroService.updateHero(this.heroId, this.heroName, this.heroAbilities);
  }

  onClose() {
    this.saveChanges();
    this.close.emit();
  }

  onOpenDraw() {
    this.saveChanges();
    this.openDraw.emit();
  }
}
