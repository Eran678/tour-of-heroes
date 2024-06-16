import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { Hero } from '../objects/hero';
import { HEROES } from '../mock-heroes';
import { MessageService } from './message.service';
import { MessageType } from '../objects/message';
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
    const heroes = this.getHeroes();
    this.messageService.add('HeroService: fetched heroes', MessageType.Info);
    return heroes.pipe(map((heroes) => heroes.map((hero: Hero) => ({ id: hero.id, name: hero.name }))));
  }

  addHero(name: string, abilities: string[]): Observable<number> { // adds a hero to the hero array
    const fork = forkJoin([this.getHeroes(), this.getMaxId()])
    return fork.pipe(
      map(([heroes, maxId]) => {
        const newHero: Hero = { id: maxId + 1, name, abilities};
        heroes.push(newHero);
        this.messageService.add(`HeroService: added hero id=${newHero.id}`, MessageType.Info);
        return newHero.id;
      })
    );
  }

  updateHero(heroId: number, name: string, abilities: string[]): Observable<void> { // updates hero
    const hero = this.findHero(heroId);
    return hero.pipe(
      map(hero => {
        if (!hero) return;
        hero.name = name;
        hero.abilities = abilities;
      })
    );
  }

  private getMaxId(): Observable<number> {
    const heroes = this.getHeroes();
    const heroIds = heroes.pipe(map(heroes => heroes.map(hero => hero.id)));
    return heroIds.pipe( // after getting heroIds, take the max one (still in observable)
      map(ids => Math.max(...ids))
    );
  }

  deleteHero = (heroId: number): Observable<void> => { // deletes a hero from the hero array
    const heroes = this.getHeroes();
    return heroes.pipe(
      map (heroes => {
        heroes.splice(heroes.findIndex(hero => hero.id == heroId), 1);
        this.messageService.add(`HeroService: deleted hero id=${heroId}`, MessageType.Info);
      })
    )
  }

  changeHeroIndex = (heroId: number, move: number): Observable<number | undefined> => { // changes the position of a hero in the array (used to change ranks)
    const fork = forkJoin([this.getHeroes(), this.findHeroIndex(heroId)])
    return fork.pipe(
      map(([heroes, index]) => {
        if (index == undefined || index + move < 0 || index + move >= heroes.length)
          {
            this.messageService.add(`HeroService: couldn't move hero id=${heroId}`, MessageType.Warning);
            return index;
          }
          const hero:Hero = heroes.splice(index, 1)[0];
          heroes.splice(index + move, 0, hero);
          this.messageService.add(`HeroService: moved hero id=${heroId}`, MessageType.Info);
          return index + move;
      })
    );
  }

  updateImage(heroId: number, imageBlob: Blob, isImageDrawn: boolean): Observable<void> {
    const hero = this.findHero(heroId);
    return hero.pipe(
      map (hero => {
        if (!hero) return;
        hero.image = imageBlob;
        hero.isImageDrawn = isImageDrawn;
      })
    );
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
    const heroes = this.getHeroes();
    return heroes.pipe(map(heroes => heroes.find(hero => hero.id == heroId)));
  }

  findHeroIndex(heroId: number): Observable<number | undefined> {
    const heroes = this.getHeroes();
    return heroes.pipe(map(heroes => heroes.findIndex(hero => hero.id == heroId)));
  }
}
