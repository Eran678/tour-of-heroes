import {Component, OnInit} from '@angular/core';
import {
  NgIf,
  NgFor,
  UpperCasePipe,
} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';

import {Hero} from '../hero';
import { HeroService } from '../hero.service';
import { AddHeroPanelComponent } from '../add-hero-panel/add-hero-panel.component';
import { EditHeroPanelComponent } from '../edit-hero-panel/edit-hero-panel.component';
import { MessageService } from '../message.service';

@Component({ // this component is responsible for handling the heroes list
  standalone: true,
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    UpperCasePipe,
    HeroDetailComponent,
    AddHeroPanelComponent,
    EditHeroPanelComponent
  ],
})

export class HeroesComponent implements OnInit {
  heroes: Hero[] = []; // the array of heroes shown in the list
  selectedHero?: Hero; // current hero that's viewed in hero detail
  isAddPanelOpen: boolean = false; // whether the 'add hero' panel is open or not
  isEditPanelOpen: boolean = false; // whether the 'edit hero' panel is open or not

  MAX_HEROES: number = 30;

  constructor(private heroService: HeroService, private messageService: MessageService) { }
  getHeroes(): void { // gets the hero array asynchronously from the service
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }
  ngOnInit(): void { // calls the function to get the hero array on init
    this.getHeroes();
  }

  onSelect(hero: Hero): void { // function called when pressing hero in list (selects hero to show detail)
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  onOpenAddPanel(): void { // function called when pressing 'add hero' button (opens 'add hero' panel)
    this.isAddPanelOpen = true;
  }
  onCloseAddPanel = () => { // function called when pressing 'x' button / background in 'add panel' (closes 'add hero' panel)
    this.isAddPanelOpen = false;
  }
  onOpenEditPanel = () => { // function called when pressing 'edit hero' button (opens 'edit hero' panel)
    this.isEditPanelOpen = true;
  }
  onCloseEditPanel = () => { // function called when pressing 'x' button / background in 'edit panel' (closes 'edit hero' panel)
    this.isEditPanelOpen = false;
  }

  onAddHero = (name: string, abilities: string[]) => { // function called when pressing 'add hero!' button in 'add panel' (adds new hero to the list)
    this.heroService.addHero(name, abilities);
    this.isAddPanelOpen = false;
  }

  onDeleteHero = () => { // function called when pressing trash button in 'hero detail' (deletes hero from the list)
    if (this.selectedHero)
      this.heroService.deleteHero(this.selectedHero.id)
    this.selectedHero = undefined;
  }

  onRankUp = () => { // function called when pressing '+' button in 'hero detail' (moves hero up in ranks)
    if (this.selectedHero)
      this.heroService.changeHeroIndex(this.selectedHero.id, -1);
  }

  onRankDown = () => { // function called when pressing '-' button in 'hero detail' (moves hero down in ranks)
    if (this.selectedHero)
      this.heroService.changeHeroIndex(this.selectedHero.id, 1);
  }
}