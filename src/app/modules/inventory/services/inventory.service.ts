import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryEndpoints } from 'src/app/models/configs/endpoints/inventory-endpoints.config';
import { AddItemRequest } from 'src/app/models/request/inventory/add-item-request.model';
import { DropItemRequest } from 'src/app/models/request/inventory/drop-item-request.model';
import { InventoryItem } from 'src/app/models/response/inventory/inventory-item';
import { ConfigService } from '../../shared/services/config.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NetworkService } from '../../shared/services/network.service';
import { ItemError } from '../../../models/errors/item-error';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class InventoryService extends NetworkService<InventoryEndpoints> {

  selectedItemId = "";

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService, protected router: Router) {
    super(http, configService, injector, eventBus);
  }

  async addItem(form: FormGroup) {
    let model = this.form2AddItemRequest(form);

    if (!model.itemId) {
      if (!this.selectedItemId) {
        return new Observable((observer) => {
          observer.error({ errorCode: 400,  message: 'Unable to add item to inventory.' });
        })
      }

      model.itemId = this.selectedItemId;
    }

    await this.waitUntilIsLoaded();

    return this.http.put(this.base_path + this.endpointsModel.add, model).pipe(catchError((error) => throwError(() => (Object.assign(new ItemError(), { itemId: error.error.itemId, errorCode: error.status, message: error.error.errors.join('\n') }) as any))));
  }

  async dropItem(form: FormGroup) {
    let model = this.form2DropItemRequest(form);

    if (!model.itemId) {
      if (!this.selectedItemId) {
        return new Observable((observer) => {
          observer.error({ errorCode: 400,  message: 'unable to drop quantity from inventory.' });
        })
      }

      model.itemId = this.selectedItemId;
    }
    await this.waitUntilIsLoaded();

    return this.http.post(this.base_path + this.endpointsModel.drop, model).pipe(catchError((error) => throwError(() => (Object.assign(new ItemError(), { itemId: error.error.itemId, errorCode: error.status, message: error.error.errors.join('\n') }) as any))));
  }

  async getItem(itemId: string) {
    await this.waitUntilIsLoaded();
    return this.http.get(this.base_path + this.endpointsModel.get + "?itemId=" + itemId).pipe(catchError((error) => throwError(() => (Object.assign(new ItemError(), { itemId: error.error.itemId, errorCode: error.status, message: error.error.errors.join('\n') }) as any))));
  }

  async list(searchString: string = "") {
    await this.waitUntilIsLoaded();

    const params : any = {}

    if (searchString) {
      params.searchString = searchString
    }

    return this.http.get(this.base_path + this.endpointsModel.list, { params }).pipe(catchError((error) => throwError(() => (Object.assign(new ItemError(), { itemId: error.error.itemId, errorCode: error.status, message: error.error.errors.join('\n') }) as any))));
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

  protected async SetEndpointsModel() {
    this.endpointsModel = await this.endpointsService.GetInventory();
  }

  protected async LoadEndpoints() {
    await this.waitUntilIsLoaded();

    if(this.endpointsModel == null) {
      return;
    }
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

    model.id = response.itemId;
    model.name = response.itemName;
    model.quantity = response.quantity;

    return model;
  }
}
