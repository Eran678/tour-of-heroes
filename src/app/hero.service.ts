import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { MessageType } from './message';
import { map } from 'rxjs';

@Injectable({ // this service is responsible for handling the hero array & data
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService) { }

  private getHeroes(): Observable<Hero[]> {
    return of(HEROES);
  }

  getHeroNames(): Observable<{id: number, name: string}[]> { // returns the hero array asynchronously
    const heroes = of(HEROES.map(h => ({id: h.id, name: h.name})));
    this.messageService.add('HeroService: fetched heroes', MessageType.Info);
    return heroes;
  }

  addHero(name: string, abilities: string[]) { // adds a hero to the hero array
    forkJoin([this.getHeroes(), this.getMaxId()]).subscribe({
      next:([heroes, maxId]) => {
        const newHero: Hero = { id:  + 1, name, abilities};
        heroes.push(newHero);
        this.messageService.add(`HeroService: added hero id=${newHero.id}`, MessageType.Info);
      }
    });
  }

  updateHero(heroId: number, name: string, abilities: string[]) { // adds a hero to the hero array
    this.findHero(heroId).subscribe(hero => {
      if (!hero) return;
      hero.name = name;
      hero.abilities = abilities;
    });
  }

  private getMaxId(): Observable<number> {
    const heroIds = of(HEROES.map(h => h.id));
    return heroIds.pipe( // after getting heroIds, take the max one (still in observable)
      map(ids => Math.max(...ids))
    );
  }

  deleteHero = (heroId: number) => { // deletes a hero from the hero array
    const heroes = this.getHeroes();
    heroes.subscribe(heroes => {
      heroes.splice(heroes.findIndex(hero => hero.id == heroId), 1);
      this.messageService.add(`HeroService: deleted hero id=${heroId}`, MessageType.Info);
    })
  }

  changeHeroIndex = (heroId: number, move: number) => { // changes the position of a hero in the array (used to change ranks)
    forkJoin([this.getHeroes(), this.findHeroIndex(heroId)]).subscribe({
      next:([heroes, index]) => {
        if (!index || index + move < 0 || index + move >= heroes.length)
        {
          this.messageService.add(`HeroService: couldn't move hero id=${heroId}`, MessageType.Warning);
          return;
        }
        const hero:Hero = heroes.splice(index, 1)[0];
        heroes.splice(index + move, 0, hero);
        this.messageService.add(`HeroService: moved hero id=${heroId}`, MessageType.Info);
      }
    })
  }

  updateImage(heroId: number, imageBlob: Blob, isImageDrawn: boolean) {
    this.findHero(heroId).subscribe(hero => {
      if (!hero) return;
      hero.image = imageBlob;
      hero.isImageDrawn = isImageDrawn;
    });
  }

  getName(heroId: number): Observable<string | undefined> {
    const hero = this.findHero(heroId);
    return hero.pipe(
      map(hero => hero?.name)
    )
  }

  getAbilities(heroId: number): Observable<string[] | undefined> {
    const hero = this.findHero(heroId);
    return hero.pipe(
      map(hero => hero?.abilities)
    )
  }

  getImage(heroId: number): Observable<{imageBlob: Blob, isImageDrawn: boolean} | undefined> {
    const hero = this.findHero(heroId);
    return hero.pipe(
      map(hero => {
        if (hero && hero.image && hero.isImageDrawn != undefined)
          return {imageBlob: hero.image, isImageDrawn: hero.isImageDrawn};
        return undefined;
      })
    );
  }

  private findHero(heroId: number): Observable<Hero | undefined> {
    const hero = of(HEROES.find(hero => hero.id == heroId));
    return hero;
  }

  findHeroIndex(heroId: number): Observable<number | undefined> {
    const index = of(HEROES.findIndex(hero => hero.id == heroId));
    return index;
  }
}
