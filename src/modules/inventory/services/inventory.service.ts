import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  private selectedItemId = "";
  selectItemState = false;

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected eventBus: EventBusService) {
    super(http, endpointsService, eventBus);
    this.endpointsModel = this.endpointsService.getInventory();
  }

  addItem(form: FormGroup) {
    let model = this.form2AddItemRequest(form);

    if (!model.itemId) {
      if (!this.selectedItemId) {
        return new Observable((observer) => {
          observer.error({ errorCode: 400,  message: 'Unable to add item to inventory.' });
        })
      }

      model.itemId = this.selectedItemId;
    }

    return this.http.put(this.base_path + this.endpointsModel.add, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  dropItem(form: FormGroup) {
    let model = this.form2DropItemRequest(form);

    if (!model.itemId) {
      if (!this.selectedItemId) {
        return new Observable((observer) => {
          observer.error({ errorCode: 400,  message: 'unable to drop quantity from inventory.' });
        })
      }

      model.itemId = this.selectedItemId;
    }

    return this.http.post(this.base_path + this.endpointsModel.drop, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  getItem(itemId: string) {
    const params = this.getQueryParamsFromObject({
      itemId
    });

    return this.http.get(this.base_path + this.endpointsModel.get, { params }).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
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

  hasItemSelected() {
    return !!this.selectedItemId;
  }

  select(itemId: string) {
    this.selectedItemId = itemId;
  }

  getSelectedItemId() {
    return this.selectedItemId
  }

  deselect() {
    this.selectedItemId = '';
  }

  // form2model

  private form2AddItemRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new AddItemRequest();

    model.itemId = form.get('itemId')?.value;
    model.quantity = form.get('itemQuantity')?.value;

    return model;
  }

  private form2DropItemRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new DropItemRequest();

    model.itemId = form.get("itemId")?.value;
    model.itemQuantity = form.get('itemQuantity')?.value;

    return model;
  }

  // response to model
  response2Item(response: any) {
    let model = new InventoryItem();

    model.itemId = response.itemId;
    model.itemName = response.itemName;
    model.quantity = response.quantity;

    return model;
  }
}
