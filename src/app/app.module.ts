import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HeroesComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
