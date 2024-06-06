import { Component, Input } from '@angular/core';
import { Hero } from '../hero';
import { MAX_ABILITIES } from '../add-hero-panel/add-hero-panel.component';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
}
