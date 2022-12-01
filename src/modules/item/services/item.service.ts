import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { CreateItemRequest } from 'src/modules/item/models/requests/create-item-request.model';
import { UpdateItemRequest } from 'src/modules/item/models/requests/update-item-request.model';
import { Item } from 'src/modules/item/models/responses/item';
import { ItemEndpoints } from '../../shared/models/endpoints/item-endpoints.config';
import { ConfigService } from '../../shared/services/config.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NetworkService } from '../../shared/services/network.service';

@Injectable()
export class ItemService extends NetworkService<ItemEndpoints> {

  selectedItemId = "";

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService, protected router: Router) {
    super(http, configService, injector, eventBus);
  }

  async createItem(form: FormGroup) {
    let model = this.form2CreateItemRequest(form);
    
    await this.waitUntilIsLoaded();

    return this.http.post(this.base_path + this.endpointsModel.create, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  async updateItem(form: FormGroup) {
    await this.waitUntilIsLoaded();

    let model = this.form2UpdateItemRequest(form);

    return this.http.patch(this.base_path + this.endpointsModel.update, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  async deleteItem(itemId: string) {
    await this.waitUntilIsLoaded();
    
    const options = this.getOptions({
      itemId: itemId
    });

    return this.http.delete(this.base_path + this.endpointsModel.delete, options).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  async getItem(itemId: string) {
    await this.waitUntilIsLoaded();

    return this.http.get<Item>(this.base_path + this.endpointsModel.get + "?itemId=" + itemId).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  async listItems(searchString: string = "") {
    await this.waitUntilIsLoaded();

    const params : any = {}

    if (searchString) {
      params.searchString = searchString
    }

    return this.http.get<any>(this.base_path + this.endpointsModel.list, { params }).pipe(catchError((error) => (this.buildError(error))));
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
    this.endpointsModel = await this.endpointsService.GetItem();
  }

  protected async LoadEndpoints() {
    await this.waitUntilIsLoaded();

    if(this.endpointsModel == null)
      return;
  }

  private getOptions(content: any) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: content
    }
  }

  // form2model

  private form2CreateItemRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new CreateItemRequest();

    model.itemName = form.get('itemName')?.value;
    model.itemDescription = form.get('itemDescription')?.value;

    return model;
  }

  private form2UpdateItemRequest(form: FormGroup) {
    if(form == null) return null;

    let model = new UpdateItemRequest();

    model.itemId = form.get("itemId")?.value;
    model.itemName = form.get('itemName')?.value;
    model.itemDescription = form.get('itemDescription')?.value;

    return model;
  }
}
