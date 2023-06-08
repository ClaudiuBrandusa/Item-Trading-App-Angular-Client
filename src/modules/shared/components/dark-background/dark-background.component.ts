import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dark-background',
  templateUrl: './dark-background.component.html',
  styleUrls: ['./dark-background.component.css']
})
export class DarkBackgroundComponent {

  @Output()
  onBackgroundClicked = new EventEmitter();

  constructor() { }

  exit() {
    this.onBackgroundClicked.emit();
  }
}
