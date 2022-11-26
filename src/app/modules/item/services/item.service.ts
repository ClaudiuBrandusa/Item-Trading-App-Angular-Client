import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ItemEndpoints } from 'src/app/models/configs/endpoints/item-endpoints.config';
import { CreateItemRequest } from 'src/app/models/request/item/create-item-request.model';
import { UpdateItemRequest } from 'src/app/models/request/item/update-item-request.model';
import { Item } from 'src/app/models/response/item/item';
import { ItemError } from '../../../models/errors/item-error';
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

    return this.http.post(this.base_path + this.endpointsModel.create, model).pipe(catchError((error) => throwError(() => (Object.assign(new ItemError(), { itemId: error.error.itemId, errorCode: error.status, message: error.error.errors.join('\n') }) as any))));
  }

  async updateItem(form: FormGroup) {
    await this.waitUntilIsLoaded();

    let model = this.form2UpdateItemRequest(form);

    return this.http.patch(this.base_path + this.endpointsModel.update, model).pipe(catchError((error) => throwError(() => (Object.assign(new ItemError(), { itemId: error.error.itemId, errorCode: error.status, message: error.error.errors.join('\n') }) as any))));
  }

  async deleteItem(itemId: string) {
    await this.waitUntilIsLoaded();
    
    const options = this.getOptions({
      itemId: itemId
    });

    return this.http.delete(this.base_path + this.endpointsModel.delete, options).pipe(catchError((error) => throwError(() => (Object.assign(new ItemError(), { itemId: error.error.itemId, errorCode: error.status, message: error.error.errors.join('\n') }) as any))));
  }

  async getItem(itemId: string) {
    await this.waitUntilIsLoaded();

    return this.http.get<Item>(this.base_path + this.endpointsModel.get + "?itemId=" + itemId).pipe(catchError((error) => throwError(() => (Object.assign(new ItemError(), { itemId: error.error.itemId, errorCode: error.status, message: error.error.errors.join('\n') }) as any))));
  }

  async listItems(searchString: string = "") {
    await this.waitUntilIsLoaded();

    const params : any = {}

    if (searchString) {
      params.searchString = searchString
    }

    return this.http.get<any>(this.base_path + this.endpointsModel.list, { params }).pipe(catchError((error) => (Object.assign(new ItemError(), { itemId: error.error.itemId, errorCode: error.status, message: error.error.errors.join('\n') }) as any)));
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
