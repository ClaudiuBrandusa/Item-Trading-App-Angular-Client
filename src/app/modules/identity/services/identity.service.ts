import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { RefreshTokenRequest } from 'src/app/models/request/identity/refresh-token-request.model';

@Injectable({
  providedIn: 'root'
})
export abstract class IdentityService {

  constructor(protected http: HttpClient) { }

  protected base_path = "http://localhost:5000/identity/";

  protected setTokens(response: Object) {
    this.clearTokens();
    
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

  protected clearTokens() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
}
