import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { MessageType } from './message';

@Injectable({ // this service is responsible for handling the hero array & data
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> { // returns the hero array asynchronously
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes', MessageType.Info);
    return heroes;
  }

  addHero(name: string, abilities: string[]): void { // adds a hero to the hero array
    let newHero: Hero = { id: this.getMaxId() + 1, name, abilities};
    HEROES.push(newHero);
    this.messageService.add(`HeroService: added hero id=${newHero.id}`, MessageType.Info);
  }

  getMaxId(): number { // returns the max value of 'id' from the hero array (used to give new heroes unique id's)
    let ids = HEROES.map(hero => hero.id);
    return Math.max(...ids);
  }

  deleteHero = (heroId: number) => { // deletes a hero from the hero array
    HEROES.splice(HEROES.findIndex(hero => hero.id == heroId), 1);
    this.messageService.add(`HeroService: deleted hero id=${heroId}`, MessageType.Info);
  }

  changeHeroIndex = (heroId: number, move: number) => { // changes the position of a hero in the array (used to change ranks)
    let index = HEROES.findIndex(hero => hero.id == heroId);
    if (index + move < 0 || index + move >= HEROES.length)
    {
      this.messageService.add(`HeroService: couldn't move hero id=${heroId}`, MessageType.Warning);
      return;
    }
    let hero:Hero = HEROES.splice(index, 1)[0];
    HEROES.splice(index + move, 0, hero);
    this.messageService.add(`HeroService: moved hero id=${heroId}`, MessageType.Info);
  }
}
