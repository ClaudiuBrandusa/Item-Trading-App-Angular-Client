import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RefreshTokenRequest } from 'src/app/models/request/identity/refresh-token-request.model';
import { IdentityService } from './identity.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService extends IdentityService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  private refresh_path = this.base_path + "refresh";

  private getToken() {
    var result = localStorage.getItem("token");
    return result === null ? "" : result.toString();
  }

  private getRefreshToken() {
    var result = localStorage.getItem("refreshToken");
    return result === null ? "" : result.toString();
  }

  private getRefreshTokenRequest() {
    var request = new RefreshTokenRequest();
    request.token = this.getToken();
    request.refreshToken = this.getRefreshToken();
    return request;
  }

  canRefreshTokens() {
    // if we have token and refresh token then it means that we have the necessarily data for token refresh
    return this.getToken() !== "" && this.getRefreshToken() !== "";
  }

  refreshTokens() {
    this.http.post(this.refresh_path, this.getRefreshTokenRequest())
  }
}
