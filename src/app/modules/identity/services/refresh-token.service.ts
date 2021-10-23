import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshTokenRequest } from 'src/app/models/request/identity/refresh-token-request.model';
import { IdentityService } from './identity.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService extends IdentityService {

  constructor(protected http: HttpClient, private router: Router) {
    super(http);
  }

  private refresh_path = this.base_path + "refresh";

  getToken() {
    var result = localStorage.getItem("token");
    return result === null ? "" : result.toString();
  }

  getRefreshToken() {
    var result = localStorage.getItem("refreshToken");
    return result === null ? "" : result.toString();
  }

  private getRefreshTokenRequest() {
    var request = new RefreshTokenRequest();
    request.token = this.getToken();
    request.refreshToken = this.getRefreshToken();
    return request;
  }

  updateToken(token: string) {
    localStorage.setItem("token", token);
  }

  updateRefreshToken(refreshToken: string) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  canRefreshTokens() {
    // if we have token and refresh token then it means that we have the necessarily data for token refresh
    return this.getToken() !== "" && this.getRefreshToken() !== "";
  }

  getRefreshTokensRequest() {
    return this.http.post(this.refresh_path, this.getRefreshTokenRequest())
  }

  refreshTokens() {
    this.getRefreshTokensRequest().subscribe(result => {
      this.setTokens(result);
    }, err => {
      this.signOut();
    });
  }

  isLoggedIn() {
    return this.canRefreshTokens();
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
