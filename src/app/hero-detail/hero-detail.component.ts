import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgFor, NgIf, UpperCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { HeroService } from '../services/hero.service';

@Component({ // this component is responsible for handling the hero detail panel
  standalone: true,
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  imports: [FormsModule, NgIf, NgFor, UpperCasePipe],
})
export class HeroDetailComponent {
  private _heroId!: number; // hero that's being viewed

  @Input()
  set heroId(id: number) {
    if (this._heroId == id) return;
    this._heroId = id;
    this.getHeroData();
  }

  get heroId(): number {
    return this._heroId;
  }

  @Output() openEdit = new EventEmitter;
  @Output() delete = new EventEmitter;
  @Output() rankUp = new EventEmitter;
  @Output() rankDown = new EventEmitter;
  
  heroName?: string;
  heroAbilities?: string[];
  rank?: number;
  image?: string;

  constructor(private heroService: HeroService) {}

  getHeroData() {
    this.getName();
    this.getAbilities();
    this.getRank();
    this.getImage();
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

  getRank() {
    this.heroService.findHeroIndex(this.heroId).subscribe(index => {
      if (index != undefined)
        this.rank = index + 1;
      else
        this.rank = undefined;
    });
  }

  getImage() { // returns url for the blob that's representing hero image
    this.heroService.getImage(this.heroId).subscribe(image => {
      if (image)
        this.image = URL.createObjectURL(image.imageBlob);
      else
        this.image = undefined;
    });
  }

  deleteHero() {
    this.heroService.deleteHero(this.heroId).subscribe(() => {
      this.delete.emit();
    })
  }

  onRankUp() {
    this.heroService.changeHeroIndex(this.heroId, -1).subscribe(index => {
      if (index != undefined)
        this.rank = index + 1;
      this.rankUp.emit();
    });
  }

  onRankDown() {
    this.heroService.changeHeroIndex(this.heroId, 1).subscribe(index => {
      if (index != undefined)
        this.rank = index + 1;
      this.rankDown.emit();
    });
  }
}