import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemEndpoints } from 'src/app/models/configs/endpoints/item-endpoints.config';
import { CreateItemRequest } from 'src/app/models/request/item/create-item-request.model';
import { Item } from 'src/app/models/response/item/item';
import { ConfigService } from '../../shared/services/config.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NetworkService } from '../../shared/services/network.service';

@Injectable()
export class ItemService extends NetworkService<ItemEndpoints> {

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService, protected router: Router) {
    super(http, configService, injector, eventBus);
  }

  async createItem(form: FormGroup) {
    let model = this.form2CreateItemRequest(form);
    
    await this.waitUntilIsLoaded();

    let result: any = null;

    await this.http.post(this.base_path + this.endpointsModel.create, model).toPromise().then(response => {
      console.log(response);
      result = response;
    }).catch();

    if(result == null) return false;

    // if the request had failed
    if(!result.hasOwnProperty("itemId")) return false;

    return true; // for now we are just returning boolean results
  }

  async updateItem(form: FormGroup) {
    await this.waitUntilIsLoaded();

  }

  async deleteItem(itemId: string) {
    await this.waitUntilIsLoaded();

  }

  async getItem(itemId: string): Promise<Item> {
    await this.waitUntilIsLoaded();

    let result: any;

    await this.http.get<Item>(this.base_path + this.endpointsModel.get + "?itemId=" + itemId).toPromise().then(response => {
      if(response != null) {
        result = response;
        
      }
    }).catch();
  
    return result;
  }

  async listItems() {
    await this.waitUntilIsLoaded();

    let result: any;

    await this.http.get<any>(this.base_path + this.endpointsModel.list).toPromise().then(response => {
      if(response != null && response.hasOwnProperty("itemsId")) {
        result = response.itemsId;
      }
    }).catch();

    return result;
  }

  protected async SetEndpointsModel() {
    this.endpointsModel = await this.endpointsService.GetItem();
  }

  protected async LoadEndpoints() {
    await this.waitUntilIsLoaded();

    if(this.endpointsModel == null)
      return;
  }

  // form2model

  private form2CreateItemRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new CreateItemRequest();

    model.itemName = form.get('itemName').value;
    model.itemDescription = form.get('itemDescription').value;

    return model;
  }
}