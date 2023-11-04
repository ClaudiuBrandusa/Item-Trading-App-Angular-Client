import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IdentityService } from './identity.service';
import { RefreshTokenRequest } from 'src/modules/identity/models/requests/refresh-token-request.model';
import { EndpointsService } from '../../app/services/endpoints.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { disconnectInit } from '../store/identity/identity.actions';
import { AuthenticationResponse } from '../models/responses/authentication.response';

@Injectable({
  providedIn: "root"
})
export class RefreshTokenService extends IdentityService {
  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected navigationService: NavigationService, private store: Store) {
    super(http, endpointsService, navigationService);
    this.refresh_path = this.base_path + this.endpointsModel.refresh;
  }

  private refresh_path = this.base_path + "refresh";

  getToken() {
    const result = localStorage.getItem("token");
    return result === null ? "" : result.toString();
  }

  getRefreshToken() {
    const result = localStorage.getItem("refreshToken");
    return result === null ? "" : result.toString();
  }

  getTokenExpirationDate() {
    const result = localStorage.getItem("expirationDateTime");
    return result === null ? null : new Date(result);
  }

  isTokenExpired() {
    const result = localStorage.getItem("expirationDateTime");
    if (result === null) return false;
    const expirationDate = new Date(result);
    return new Date() > expirationDate;
  }

  private getRefreshTokenOptions() {
    var request = new RefreshTokenRequest();
    request.token = this.getToken();
    request.refreshToken = this.getRefreshToken();
    return request;
  }

  canRefreshTokens() {
    // if we have token and refresh token then it means that we have the necessarily data for token refresh
    return this.getToken() !== "" && this.getRefreshToken() !== "" && !this.isTokenExpired();
  }

  getRefreshTokenObservable() {
    return this.http.post<AuthenticationResponse>(this.refresh_path, this.getRefreshTokenOptions());
  }

  async refresh() {
    if (!this.canRefreshTokens()) {
      const token = this.getToken();
      this.store.dispatch(disconnectInit(token));
      return Promise.reject();
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await lastValueFrom(this.getRefreshTokenObservable());
        
        if (this.setTokens(response))
        {
          resolve(1);
        } else {
          reject();
        }
      } catch (exception) {
        if (exception.status === 400) {
          this.store.dispatch(disconnectInit(""));
        }
        reject();
      }
    });

    return promise;
  }

  signOut() {
    this.discardData();
    this.navigationService.redirect("login");
  }

  discardData() {
    this.clearTokens();
  }
}
