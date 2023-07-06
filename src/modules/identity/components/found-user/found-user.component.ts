import { Component, Input } from '@angular/core';
import { FoundUserResponse } from '../../models/responses/found-user.response';

@Component({
  selector: 'app-found-user',
  templateUrl: './found-user.component.html',
  styleUrls: ['./found-user.component.css']
})
export class FoundUserComponent {

  @Input()
  foundUser: FoundUserResponse = new FoundUserResponse();
  
  constructor() {}
}
