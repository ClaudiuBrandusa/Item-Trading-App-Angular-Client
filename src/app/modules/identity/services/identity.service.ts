import { Injectable } from '@angular/core';
import { LoginRequest } from 'src/app/models/request/identity/loginRequest.model';
import { HttpClient } from '@angular/common/http'
import { FormGroup } from '@angular/forms';
import { RegisterRequest } from 'src/app/models/request/identity/registerRequest.model';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  constructor(private http: HttpClient) { }

  private base_path = "http://localhost:5000/identity/";

  private login_path = this.base_path + "login";

  private register_path = this.base_path + "register";

  login(form: FormGroup) {
    this.http.post(this.login_path, this.form2LoginRequest(form)).subscribe(response => {
      this.setTokens(response);
    }, err => {
      // something went wrong
    })
  }

  register(form: FormGroup) {
    this.http.post(this.register_path, this.form2RegisterRequest(form)).subscribe(response => {
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

  private form2RegisterRequest(form: FormGroup) {
    var model = new RegisterRequest();
    model.username = form.get('username').value;
    model.email = form.get('email').value;
    model.password = form.get('password').value;
    model.confirmPassword = form.get('confirm_password').value;
    return model;
  }

  private setTokens(response: Object) {
    this.removeTokens();
    
    var somethingWentWrong = false;
      
    if(response.hasOwnProperty("token")) {
      localStorage.setItem("token", (<any>response).token);
    } else {
      somethingWentWrong = true;
    }

    if(response.hasOwnProperty("refreshToken")) {
      localStorage.setItem("refreshToken", (<any>response).refreshToken);
    } else {
      somethingWentWrong = true;
    }

    return !somethingWentWrong;
  }

  private removeTokens() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
}
