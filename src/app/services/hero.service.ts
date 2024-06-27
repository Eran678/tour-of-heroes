import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, switchMap, EMPTY, catchError } from 'rxjs';
import { MessageService } from './message.service';
import { MessageType } from '../objects/message';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ // this service is responsible for handling the hero array & data
  providedIn: 'root'
})
export class HeroService {

  private baseUrl = 'http://localhost:8080';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getHeroNames(): Observable<{id: number, name: string}[]> { // returns the hero array asynchronously
    const url = `${this.baseUrl}/names`;

    return this.http.get<Map<number, string>>(url).pipe(
      map(data => {
        this.messageService.add('HeroService: fetched heroes', MessageType.Info);
        return Object.entries(data).map(([id, name]) => ({ id: parseInt(id), name }));
      })
    );
  }

  addHero(name: string, abilities: string[]): Observable<{id: number, name: string}> { // adds a hero to the hero array
    const url = `${this.baseUrl}/addHero`;

    return this.http.post<number>(url, {name, abilities}).pipe(
      map(id => {
        this.messageService.add(`HeroService: added hero id=${id}`, MessageType.Info);
        return {id, name};
      }));
  }

  updateHero(heroId: number, name: string, abilities: string[]): Observable<void> { // updates hero
    const url = `${this.baseUrl}/updateHero`;

    return this.http.post<void>(url, {heroId, name, abilities})
  }

  deleteHero = (heroId: number): Observable<void> => { // deletes a hero from the hero array
    const url = `${this.baseUrl}/deleteHero`;

    return this.http.post<number>(url, {heroId}).pipe(
      map(() => {
        this.messageService.add(`HeroService: deleted hero id=${heroId}`, MessageType.Info);
      }));
  }

  getAbilities(heroId: number): Observable<string[] | undefined> {
    const url = `${this.baseUrl}/${heroId}/abilities`;

    return this.http.get<string[] | undefined>(url).pipe(
      map(data => {
        return data
      })
    );
  }

  getImage(heroId: number): Observable<{ imageBlob: Blob, isImageDrawn: boolean } | undefined> {
    const url = `${this.baseUrl}/${heroId}/image`;

    return this.http.get<{ image: string | null, isImageDrawn: boolean } | undefined>(url).pipe(
      map(data => {
        if (data && data.image) {
          const byteCharacters = atob(data.image); // decode Base64 string to binary data
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const imageBlob = new Blob([byteArray], { type: 'image/jpg' }); // Adjust the 'type' based on your image format

          return { imageBlob, isImageDrawn: data.isImageDrawn };
        }
        return undefined;
      })
    );
  }

  updateImage(heroId: number, imageBlob: Blob, isImageDrawn: boolean): Observable<void> {
    const url = `${this.baseUrl}/updateImage`;

    return new Observable<void>(observer => {
      const reader = new FileReader();

      reader.onloadend = () => {
        let base64Image = reader.result as string; // Cast result to string (Base64 encoded)

        // Remove data URL prefix (e.g., 'data:image/jpeg;base64,')
        base64Image = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

        // Example: Send Base64 string to backend via HTTP POST
        this.http.post<void>(url, { heroId, image: base64Image, isImageDrawn }).pipe(
          switchMap(() => {
            observer.next();    // Emit void (or you can emit a value here)
            observer.complete(); // Complete the observable
            return EMPTY;       // Return an empty observable to complete the chain
          }),
          catchError(error => {
            observer.error(error); // Emit error to observer
            return EMPTY;          // Return an empty observable to complete the chain
          })
        ).subscribe(); // Subscribe to start the HTTP POST operation
      };

      // Start reading the Blob as Base64 string
      reader.readAsDataURL(imageBlob);
    });
  }
}
