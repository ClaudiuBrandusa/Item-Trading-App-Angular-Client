import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { EventBusService } from '../../shared/services/event-bus.service';
import { EventBusUtils } from '../../shared/utils/event-bus.utility';
import { IdentityService } from './identity.service';
import { RefreshTokenRequest } from 'src/modules/identity/models/requests/refresh-token-request.model';
import { EndpointsService } from '../../app/services/endpoints.service';
import { SignalR } from '../../shared/enums/signal-r.enum';
import { NavigationService } from '../../shared/services/navigation.service';
import { TimeSpan } from '../../shared/utils/time-span';

const REFRESH_TOKEN_MILLISECONDS_BEFORE_EXPIRATION = 1500;
const DEFAULT_REFRESH_TOKEN_MILLISECONDS = 5000;

@Injectable({
  providedIn: "root"
})
export class RefreshTokenService extends IdentityService {

  private eventBusUtility: EventBusUtils;
  private timeout: NodeJS.Timeout | undefined;
  
  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected eventBus: EventBusService, protected navigationService: NavigationService) {
    super(http, endpointsService, eventBus, navigationService);
    this.refresh_path = this.base_path + this.endpointsModel.refresh;
    this.eventBusUtility = new EventBusUtils(eventBus);
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

  private getRefreshTokenOptions() {
    var request = new RefreshTokenRequest();
    request.token = this.getToken();
    request.refreshToken = this.getRefreshToken();
    return request;
  }

  canRefreshTokens() {
    // if we have token and refresh token then it means that we have the necessarily data for token refresh
    return this.getToken() !== "" && this.getRefreshToken() !== "";
  }

  getRefreshTokenObservable() {
    return this.http.post(this.refresh_path, this.getRefreshTokenOptions());
  }

  async refresh() {
    if (!this.canRefreshTokens()) return Promise.reject();

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
          this.signOut();
        }
        reject();
      }
    });

    return promise;
  }

  isLoggedIn() {
    return this.canRefreshTokens();
  }

  signOut() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    const token = this.getToken();
    if (token) this.eventBusUtility.emit(SignalR.Disconnected, token);
    this.clearTokens();
    this.navigationService.redirect("login");
  }

  protected override onTokenSet(tokenResponseObject: Object) {
    this.scheduleNextSilentRefresh(new Date((<any>tokenResponseObject).expirationDateTime));
  }

  private scheduleNextSilentRefresh(date: Date) {
    const currentDate = new Date();

    const duration = new TimeSpan(date.valueOf() - currentDate.valueOf());
    
    this.timeout = setTimeout(() => {
      this.refresh();
    }, duration.milliseconds > REFRESH_TOKEN_MILLISECONDS_BEFORE_EXPIRATION ? duration.milliseconds - REFRESH_TOKEN_MILLISECONDS_BEFORE_EXPIRATION : DEFAULT_REFRESH_TOKEN_MILLISECONDS);
  }
}
