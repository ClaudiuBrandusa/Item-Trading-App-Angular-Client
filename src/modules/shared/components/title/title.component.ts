import { Component } from '@angular/core';
import { AppComponent } from 'src/modules/app/components/app.component';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent {

  constructor(public app: AppComponent) {}

}
