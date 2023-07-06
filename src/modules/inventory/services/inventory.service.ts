import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddItemRequest } from 'src/modules/inventory/models/requests/add-item-request.model';
import { DropItemRequest } from 'src/modules/inventory/models/requests/drop-item-request.model';
import { InventoryItem } from 'src/modules/inventory/models/responses/inventory-item';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NetworkService } from '../../shared/services/network.service';
import { catchError, Observable, throwError } from 'rxjs';
import { InventoryEndpoints } from '../../shared/models/endpoints/inventory-endpoints.config';
import { EndpointsService } from '../../app/services/endpoints.service';

@Injectable()
export class InventoryService extends NetworkService<InventoryEndpoints> {

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected eventBus: EventBusService) {
    super(http, endpointsService, eventBus);
    this.endpointsModel = this.endpointsService.getInventory();
  }

  addItem(model: AddItemRequest) {
    if (!model.itemId) {
      return new Observable((observer) => {
        observer.error({ errorCode: 400,  message: 'Unable to add item to inventory.' });
      })
    }

    return this.http.put(this.base_path + this.endpointsModel.add, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  dropItem(model: DropItemRequest) {
    if (!model.itemId) {
      return new Observable((observer) => {
        observer.error({ errorCode: 400,  message: 'unable to drop quantity from inventory.' });
      })
    }

    return this.http.post(this.base_path + this.endpointsModel.drop, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  getItem(itemId: string) {
    const params = this.getQueryParamsFromObject({
      itemId
    });

    return this.http.get<InventoryItem>(this.base_path + this.endpointsModel.get, { params }).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  list(searchString: string = "") {
    const params = this.getQueryParamsFromObject({
      searchString
    });
    
    return this.http.get(this.base_path + this.endpointsModel.list, { params }).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  getLockedAmount(itemId: string) {
    const params = this.getQueryParamsFromObject({
      itemId
    });

    return this.http.get(this.base_path + this.endpointsModel.get_locked_amount, { params }).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }
}
