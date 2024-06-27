import {Component, OnInit} from '@angular/core';
import {
  NgIf,
  NgFor,
  UpperCasePipe,
} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';

import { HeroService } from '../services/hero.service';
import { AddHeroPanelComponent } from '../add-hero-panel/add-hero-panel.component';
import { EditHeroPanelComponent } from '../edit-hero-panel/edit-hero-panel.component';
import { MessageService } from '../services/message.service';
import { HttpClient } from '@angular/common/http';
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
  heroNames: {id: number, name: string}[] = []
  selectedHeroId?: number; // current hero that's viewed in hero detail
  isAddPanelOpen: boolean = false; // whether the 'add hero' panel is open or not
  isEditPanelOpen: boolean = false; // whether the 'edit hero' panel is open or not
  isDrawPanelOpen: boolean = false; // whether the drawing panel is open or not

  MAX_HEROES: number = 30;

  constructor(private heroService: HeroService, private messageService: MessageService, private http: HttpClient) { }
  getHeroes(): void { // gets the hero array asynchronously from the service
    this.heroService.getHeroNames()
        .subscribe(heroNames => {
          this.heroNames = heroNames
        });
  }
  ngOnInit(): void { // calls the function to get the hero array on init
    let sessionSave: string | null = sessionStorage.getItem("heroNames")
    if (sessionSave != null) // if already saved then use session
      this.heroNames = JSON.parse(sessionSave)
    else
      this.getHeroes(); // take from database if not loaded before to session

    this.checkForClickedMessage();
  }
  
  getSelectedHeroName() {
    return this.heroNames.find(x => x.id === this.selectedHeroId)?.name ?? "";
  }

  getSelectedHeroIndex() {
    return this.heroNames.findIndex(x => x.id === this.selectedHeroId);
  }

  getSelectedHeroRank() {
    return this.getSelectedHeroIndex() + 1
  }

  checkForClickedMessage() {
    this.messageService.getClickedMessage().subscribe(text => {
      const strIndex = text.indexOf("id=");
      if (strIndex === -1) return;
      let spaceIndex = text.indexOf(' ', strIndex);
      if (spaceIndex === -1)
        spaceIndex = text.length;
      const id = parseInt(text.substring(strIndex + 3, spaceIndex));
      if (this.heroNames.some(x => x.id === id))
        this.selectedHeroId = id;
      else
        alert(`Hero id=${id} was deleted!`);
    })
  }

  onSelect(heroId: number): void { // function called when pressing hero in list (selects hero to show detail)
    this.selectedHeroId = heroId;
    this.messageService.add(`HeroesComponent: Selected hero id=${heroId}`);
  }

  onRankUp() {
    let index = this.getSelectedHeroIndex();
    if (index === 0) return;
    let selectedHero = this.heroNames.splice(index, 1)[0];
    this.heroNames.splice(index - 1, 0, selectedHero)
    this.saveHeroNames();
  }
  onRankDown() {
    let index = this.getSelectedHeroIndex();
    if (index >= this.heroNames.length - 1) return;
    let selectedHero = this.heroNames.splice(index, 1)[0];
    this.heroNames.splice(index + 1, 0, selectedHero)
    this.saveHeroNames();
  }

  onOpenAddPanel(): void { // function called when pressing 'add hero' button (opens 'add hero' panel)
    this.isAddPanelOpen = true;
  }
  onCloseAddPanel() { // function called when pressing 'x' button / background in 'add panel' (closes 'add hero' panel)
    this.isAddPanelOpen = false;
  }
  onOpenEditPanel(){ // function called when pressing 'edit hero' button (opens 'edit hero' panel)
    this.isEditPanelOpen = true;
  }
  onCloseEditPanel(name: string) { // function called when pressing 'x' button / background in 'edit panel' (closes 'edit hero' panel)
    this.isEditPanelOpen = false;
    this.heroNames[this.getSelectedHeroIndex()].name = name;
    this.saveHeroNames();
  }

  onAddHero = (heroInfo: {id: number, name: string}) => { // function called when pressing 'add hero!' button in 'add panel' (adds new hero to the list)
    this.isAddPanelOpen = false;
    this.heroNames.push({id: heroInfo.id, name: heroInfo.name })
    this.saveHeroNames();
  }

  onDeleteHero() { // function called when pressing trash button in 'hero detail' (deletes hero from the list)
    this.heroNames.splice(this.getSelectedHeroIndex(), 1)
    this.selectedHeroId = undefined;
    this.saveHeroNames();
  }

  onOpenDrawPanel(name: string) { // function called when pressing 'draw' button in 'edit panel' (opens drawing panel)
    this.isDrawPanelOpen = true;
    this.heroNames[this.getSelectedHeroIndex()].name = name;
    this.saveHeroNames();
  }
  onCloseDrawPanel() { // function called when pressing 'x' button in drawing panel (closes drawing panel)
    this.isDrawPanelOpen = false;
  }

  saveHeroNames() { // save list to session
    sessionStorage.setItem("heroNames", JSON.stringify(this.heroNames))
  }
}