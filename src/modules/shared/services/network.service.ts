import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemError } from '../models/errors/item-error';
import { EndpointsService } from '../../app/services/endpoints.service';
import { EventBusService } from './event-bus.service';

@Injectable({
  providedIn: 'root'
})
export abstract class NetworkService<T> {
  // this class is going to be extended by all of the services which will use http requests to the API

  protected endpointsModel: T;
  protected base_path = "";

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected eventBus: EventBusService) {
    this.initEndpoints();
  }

  private initEndpoints() {
    this.base_path = this.endpointsService.getBasePath();
  }

  protected buildError(error: any) {
    return Object.assign(
      new ItemError(),
      {
        itemId: error.error.itemId,
        errorCode: error.status,
        message: error.error.errors.join('\n')
      }) as any
  }

  protected formatContentToRequestBody(content: any) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: content
    }
  }
}
