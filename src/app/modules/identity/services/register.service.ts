import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegisterRequest } from 'src/app/models/request/identity/registerRequest.model';
import { IdentityService } from './identity.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends IdentityService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  private register_path = this.base_path + "register";

  register(form: FormGroup) {
    this.http.post(this.register_path, this.form2RegisterRequest(form)).subscribe(response => {
      this.setTokens(response);
    }, err => {
      // something went wrong
    })
  }

  private form2RegisterRequest(form: FormGroup) {
    var model = new RegisterRequest();
    model.username = form.get('username').value;
    model.email = form.get('email').value;
    model.password = form.get('password').value;
    model.confirmPassword = form.get('confirm_password').value;
    return model;
  }
}
