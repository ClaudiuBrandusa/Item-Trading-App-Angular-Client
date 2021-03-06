import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../shared/services/config.service';
import { IdentityEndpoints } from 'src/app/models/configs/endpoints/identity-endpoints.config';
import { EventBusService } from '../../shared/services/event-bus.service';
import { EventData } from 'src/app/models/utils/event';
import { NetworkService } from '../../shared/services/network.service';

@Injectable()
export abstract class IdentityService extends NetworkService<IdentityEndpoints> {

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService) {
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

    this.eventBus.emit(new EventData("silentRefresh", null));

    return !somethingWentWrong;
  }

  protected clearTokens() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }

  protected async SetEndpointsModel() {
    this.endpointsModel = await this.endpointsService.GetIdentity();
  }
}
