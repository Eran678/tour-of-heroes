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
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { MessageType } from '../message';
import { DrawHeroPanelComponent } from '../draw-hero-panel/draw-hero-panel.component';

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
    EditHeroPanelComponent,
    DrawHeroPanelComponent
  ],
})

export class HeroesComponent implements OnInit {
  heroNames: {id: number, name: string}[] = []; // the array of heroes shown in the list
  selectedHeroId?: number; // current hero that's viewed in hero detail
  isAddPanelOpen: boolean = false; // whether the 'add hero' panel is open or not
  isEditPanelOpen: boolean = false; // whether the 'edit hero' panel is open or not
  isDrawPanelOpen: boolean = false; // whether the drawing panel is open or not

  MAX_HEROES: number = 30;

  constructor(private heroService: HeroService, private messageService: MessageService, private http: HttpClient) { }
  getHeroes(): void { // gets the hero array asynchronously from the service
    this.heroService.getHeroNames()
        .subscribe(heroNames => this.heroNames = heroNames);
  }
  ngOnInit(): void { // calls the function to get the hero array on init
    this.getHeroes();
  }

  onSelect(heroId: number): void { // function called when pressing hero in list (selects hero to show detail)
    this.selectedHeroId = heroId;
    this.messageService.add(`HeroesComponent: Selected hero id=${heroId}`);
  }
  onRankChange() {
    this.getHeroes(); // update hero list
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
    this.getHeroes(); // update hero list
  }

  onAddHero = () => { // function called when pressing 'add hero!' button in 'add panel' (adds new hero to the list)
    this.isAddPanelOpen = false;
    this.getHeroes(); // update hero list
  }

  onDeleteHero = () => { // function called when pressing trash button in 'hero detail' (deletes hero from the list)
    this.selectedHeroId = undefined;
    this.getHeroes(); // update hero list
  }

  onOpenDrawPanel = () => { // function called when pressing 'draw' button in 'edit panel' (opens drawing panel)
    this.isDrawPanelOpen = true;
  }
  onCloseDrawPanel = () => { // function called when pressing 'x' button in drawing panel (closes drawing panel)
    this.isDrawPanelOpen = false;
  }
}