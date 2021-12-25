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

@Injectable()
export class InventoryService extends NetworkService<InventoryEndpoints> {

  selectedItemId = "";

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService, protected router: Router) {
    super(http, configService, injector, eventBus);
  }

  async addItem(form: FormGroup) {
    let model = this.form2AddItemRequest(form);

    await this.waitUntilIsLoaded();
    
    let result: any = null;

    await this.http.put(this.base_path + this.endpointsModel.add, model).toPromise().then(response => {
      if(this.gotNoError(response)) {
        result = response as InventoryItem;
      }
    }).catch();

    return result;
  }

  async dropItem(form: FormGroup) {
    let model = this.form2DropItemRequest(form);

    await this.waitUntilIsLoaded();
    
    let result: any = null;

    await this.http.post(this.base_path + this.endpointsModel.drop, model).toPromise().then(response => {
      if(this.gotNoError(response)) {
        result = response as InventoryItem;
      }
    }).catch();

    return result;
  }

  async getItem(itemId: string) {
    await this.waitUntilIsLoaded();

    let result: any = null;

    await this.http.get(this.base_path + this.endpointsModel.get + "?itemId=" + itemId).toPromise().then(response => {
      if(this.gotNoError(response)) {
        result = this.response2Item(response);
      }
    }).catch();

    return result;
  }

  async list() {
    await this.waitUntilIsLoaded();

    let result: any = null;

    await this.http.get(this.base_path + this.endpointsModel.list).toPromise().then((response : any) => {
      if(this.gotNoError(response) && response.hasOwnProperty("itemsId")) {
        result = response.itemsId // a list of the items' id from the user's inventory
      }
    }).catch();

    return result;
  }

  select(itemId: string) {
    this.selectedItemId = itemId;
  }

  getSelectedItemId() {
    return this.selectedItemId
  }

  deselect() {
    this.selectedItemId = "";
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

  private gotNoError(response: any) {
    return response != null && !response.hasOwnProperty("errors");
  }

  // form2model

  private form2AddItemRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new AddItemRequest();

    model.itemId = form.get('itemId').value;
    model.itemQuantity = form.get('itemQuantity').value;

    return model;
  }

  private form2DropItemRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new DropItemRequest();

    model.itemId = form.get("itemId").value;
    model.itemQuantity = form.get('itemQuantity').value;

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
