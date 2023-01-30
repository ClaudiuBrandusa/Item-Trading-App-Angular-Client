import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { RefreshTokenOptions } from '../../shared/models/options/refresh-token-options.config';
import { ConfigService } from '../../shared/services/config.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { Interval } from '../../shared/utils/async-utils';
import { EventBusUtils } from '../../shared/utils/event-bus.utility';
import { EventData } from '../../shared/utils/event-data';
import { IdentityService } from './identity.service';
import { RefreshTokenRequest } from 'src/modules/identity/models/requests/refresh-token-request.model';

@Injectable({
  providedIn: "root"
})
export class RefreshTokenService extends IdentityService implements OnInit, OnDestroy {

  private eventBusUtility: EventBusUtils;
  
  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService, protected router: Router, private eventBusService: EventBusService) {
    super(http, configService, injector, eventBus, router);
    this.eventBusUtility = new EventBusUtils(eventBus);
    this.InitOptions();
  }

  ngOnInit(): void {
    this.initEventBusSubscription();
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  options: RefreshTokenOptions = null;

  silentRefresh: Subscription;

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
    if(!this.loaded)
      return null; // won't happen if we are not trying to refresh the token in the first milliseconds from creating the component

    return this.http.post(this.refresh_path, this.getRefreshTokenRequest());
  }

  async refreshTokens() {
    if(this.canRefreshTokens()) {
      let result: Observable<Object>;
      await Interval(() => {
        result = this.getRefreshTokensRequest(); 
        return result == null; // we will continue until we get a non null result
      }, 100, 4000);
      if(result == null) {
        return; 
      }
      result.subscribe({
        next: result => {
        this.setTokens(result);
      }, 
      error: _err => {
        this.signOut();
      }});
    }
  }

  isLoggedIn() {
    return this.canRefreshTokens();
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  private initEventBusSubscription() {
    this.eventBusUtility.on('silentRefresh', async () => {
      this.startSilentRefresh();
    });
  }

  private async startSilentRefresh() {
    if(this.options == null) {
      await this.GetOptions();
      if(this.options == null) {
        return;
      }
    }
    this.silentRefresh = interval(this.options.silentRefreshIntervalInSeconds * 1000)
    .subscribe(() => {
      this.refreshTokens()
    });
  }

  private async InitOptions() {
    this.options = await this.configService.loadOptions<RefreshTokenOptions>("refreshTokenOptions");
  }

  async GetOptions() {
    if(this.options == null) {
      await Interval(() => this.options == null, 50, 5000);
    }

    return this.options;
  }

  protected async LoadEndpoints() {
    await this.waitUntilIsLoaded();
    
    if(this.endpointsModel == null)
      return;

    this.refresh_path = this.base_path + this.endpointsModel.refresh;
  }
}
