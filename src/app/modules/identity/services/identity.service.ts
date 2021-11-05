import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../shared/services/config.service';
import { EndpointsService } from '../../shared/services/endpoints.service';
import { IdentityEndpoints } from 'src/app/models/configs/endpoints/identity-endpoints.config';
import { Interval } from 'src/app/models/utils/async-utils';
import { EventBusService } from '../../shared/services/event-bus.service';
import { EventData } from 'src/app/models/utils/event';

@Injectable()
export abstract class IdentityService {

  protected endpointsService: EndpointsService;
  protected identityEndpoints: IdentityEndpoints;
  protected loaded = false;

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService) {
    this.InitEndpoints();
   }

  protected base_path = "";

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

  protected async SetBaseEndpoint() {
    if(this.base_path != "") {
      return true;
    }

    this.base_path = await this.endpointsService.GetBasePath();
    
    if(this.base_path == null)
      return false;
    
    return true;
  }

  private async SetEndpointsModel() {
    this.identityEndpoints = await this.endpointsService.GetIdentity();
  }

  private async InitEndpoints() {
    this.endpointsService = this.injector.get<EndpointsService>(EndpointsService);

    await this.SetBaseEndpoint();
    await this.SetEndpointsModel();
    await this.LoadEndpoints();

    this.loaded = true;
  }

  async WaitUntilIsLoaded() {
    return Interval(() => !this.loaded, 25, 3000);
  }

  protected abstract LoadEndpoints()
}
