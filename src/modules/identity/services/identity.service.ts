import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../shared/services/config.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NetworkService } from '../../shared/services/network.service';
import { Router } from '@angular/router';
import { EventData } from '../../shared/utils/event-data';
import { IdentityEndpoints } from '../../shared/models/endpoints/identity-endpoints.config';

@Injectable()
export abstract class IdentityService extends NetworkService<IdentityEndpoints> {

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService, protected router: Router) {
    super(http, configService, injector, eventBus);
   }

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

    if(!somethingWentWrong)
      this.eventBus.emit(new EventData("silentRefresh", null));

    this.RedirectToDefaultPage();

    return !somethingWentWrong;
  }

  protected clearTokens() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }

  protected async SetEndpointsModel() {
    this.endpointsModel = await this.endpointsService.GetIdentity();
  }

  private RedirectToDefaultPage() {
    this.router.navigate([""]);
  }
  
  updateTokens(newTokens: any) {
    if(this.setTokens(newTokens)) {
      let router = this.injector.get(Router);
      this.eventBus.emit(new EventData('connected', newTokens.token));
      router.navigate([""]);
    }
  }
}
