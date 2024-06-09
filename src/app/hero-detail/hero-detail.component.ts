import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgFor, NgIf, UpperCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Hero} from '../hero';

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
  @Input() openEdit!: () => void; // function called when pressing 'edit hero' button
  @Input() deleteHero!: () => void; // function called when pressing trash button
  @Input() rankUp!: () => void; // function called when pressing '+' button (moves hero up in the ranks)
  @Input() rankDown!: () => void; // function called when pressing '-' button (moves hero down in the ranks)
  image?: string;

  ngOnChanges(changes: SimpleChanges): void { // whenever the hero detail needs to render a hero it regenerates the image
    this.getImage();
  }

  getImage() { // returns url for the blob that's representing hero image
    if (this.hero && this.hero.image)
      this.image = URL.createObjectURL(this.hero.image);
    else
      this.image = undefined;
  }
}