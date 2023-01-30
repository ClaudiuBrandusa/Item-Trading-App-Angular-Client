import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ItemError } from '../models/errors/item-error';
import { Interval } from '../utils/async-utils';
import { ConfigService } from './config.service';
import { EndpointsService } from '../../app/services/endpoints.service';
import { EventBusService } from './event-bus.service';

@Injectable({
  providedIn: 'root'
})
export abstract class NetworkService<T> {
  // this class is going to be extended by all of the services which will use http requests to the API

  protected endpointsModel: T;

  protected endpointsService: EndpointsService;
  protected loaded = false;

  protected base_path = "";

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService) {
    this.InitEndpoints();
  }

  private async InitEndpoints() {
    this.endpointsService = this.injector.get<EndpointsService>(EndpointsService);

    await this.SetBaseEndpoint();
    await this.SetEndpointsModel();
    await this.LoadEndpoints();

    this.loaded = true;
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

  // the subclass will define it's model 
  protected abstract SetEndpointsModel();

  async waitUntilIsLoaded() {
    return Interval(() => !this.loaded, 25, 3000);
  }

  protected abstract LoadEndpoints()

  protected buildError(error: any) {
    return Object.assign(
      new ItemError(),
      {
        itemId: error.error.itemId,
        errorCode: error.status,
        message: error.error.errors.join('\n')
      }) as any
  }

  protected getOptions(content: any) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: content
    }
  }
}
