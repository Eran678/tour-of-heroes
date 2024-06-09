import {Component, EventEmitter, Input, OnChanges, SimpleChanges, Output} from '@angular/core';
import {NgFor, NgIf, UpperCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Hero} from '../hero';
import { HeroService } from '../hero.service';

@Component({ // this component is responsible for handling the hero detail panel
  standalone: true,
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  imports: [FormsModule, NgIf, NgFor, UpperCasePipe],
})
export class HeroDetailComponent implements OnChanges {
  @Input() hero!: Hero; // hero that's being viewed
  @Input() rank!: number; // rank of the hero in the list
  @Output() openEdit = new EventEmitter;
  @Output() delete = new EventEmitter;
  
  image?: string;

  constructor(private heroService: HeroService) {}

  ngOnChanges(changes: SimpleChanges): void { // whenever the hero detail needs to render a hero it regenerates the image
    this.getImage();
  }

  getImage() { // returns url for the blob that's representing hero image
    if (this.hero && this.hero.image)
      this.image = URL.createObjectURL(this.hero.image);
    else
      this.image = undefined;
  }

  deleteHero() {
    this.heroService.deleteHero(this.hero.id)
    this.delete.emit();
  }

  rankUp = () => {
    this.heroService.changeHeroIndex(this.hero.id, -1);
  }

  rankDown = () => {
    this.heroService.changeHeroIndex(this.hero.id, 1);
  }
}