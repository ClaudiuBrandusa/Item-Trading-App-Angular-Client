import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginRequest } from 'src/app/models/request/identity/loginRequest.model';
import { IdentityService } from './identity.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends IdentityService {

  constructor(protected http: HttpClient){
    super(http);
  }

  private login_path = this.base_path + "login";

  login(form: FormGroup) {
    this.http.post(this.login_path, this.form2LoginRequest(form)).subscribe(response => {
      this.setTokens(response);
    }, err => {
      // something went wrong
    })
  }

  private form2LoginRequest(form: FormGroup) {
    var model = new LoginRequest();
    model.username = form.get('username').value;
    model.password = form.get('password').value;
    return model;
  }
}
