import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Tour of Heroes';

  constructor(private titleService:Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("Tour of Heroes");
  }
}