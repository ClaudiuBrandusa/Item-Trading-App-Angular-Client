import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ItemEndpoints } from 'src/app/models/configs/endpoints/item-endpoints.config';
import { Item } from 'src/app/models/response/item/item';
import { ConfigService } from '../../shared/services/config.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NetworkService } from '../../shared/services/network.service';

@Injectable()
export class ItemService extends NetworkService<ItemEndpoints> {

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService, protected router: Router) {
    super(http, configService, injector, eventBus);
  }

  async createItem() {

  }

  async updateItem() {

  }

  async deleteItem() {

  }

  async getItem(itemId: string): Promise<Item> {
    await this.WaitUntilIsLoaded();

    let result: any;

    await this.http.get<Item>(this.base_path + this.endpointsModel.get + "?itemId=" + itemId).toPromise().then(response => {
      if(response != null) {
        result = response;
      }
    }).catch();
  
    return result;
  }

  async listItems() {
    await this.WaitUntilIsLoaded();

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
    await this.WaitUntilIsLoaded();

    if(this.endpointsModel == null)
      return;
  }
}
