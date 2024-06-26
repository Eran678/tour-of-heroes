import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HeroService } from '../services/hero.service';

export const MAX_ABILITIES: number = 3;

@Component({ // this component is responsible for handling the 'add hero' form
  standalone: true,
  selector: 'app-add-hero-panel',
  templateUrl: './add-hero-panel.component.html',
  styleUrls: ['./add-hero-panel.component.scss'],
  imports: [FormsModule, NgFor]
})
export class AddHeroPanelComponent {
  @Output() close = new EventEmitter();
  @Output() add = new EventEmitter<{id: number, name: string}>(); // function called when pressing 'add hero' button

  // values of hero
  heroName: string = "";
  heroAbilities: string[] = ["", ""];

  constructor(private heroService: HeroService) {}

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

  addHero() {
    this.heroService.addHero(this.heroName, this.heroAbilities).subscribe(heroInfo => {
      this.add.emit(heroInfo);
    });
  }
}
