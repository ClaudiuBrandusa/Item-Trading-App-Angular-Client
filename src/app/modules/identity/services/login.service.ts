import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginRequest } from 'src/app/models/request/identity/loginRequest.model';
import { IdentityService } from './identity.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { EventData } from 'src/app/models/utils/event';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends IdentityService {

  constructor(protected http: HttpClient, private eventBus: EventBusService){
    super(http);
  }

  private login_path = this.base_path + "login";

  login(form: FormGroup) {
    this.http.post(this.login_path, this.form2LoginRequest(form)).subscribe(response => {
      this.setTokens(response);
      this.eventBus.emit(new EventData("silentRefresh", null));
    }, err => {})
  }

  private form2LoginRequest(form: FormGroup) {
    var model = new LoginRequest();
    model.username = form.get('username').value;
    model.password = form.get('password').value;
    return model;
  }
}
