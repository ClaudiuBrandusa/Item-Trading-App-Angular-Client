import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { CreateItemRequest } from 'src/modules/item/models/requests/create-item-request.model';
import { UpdateItemRequest } from 'src/modules/item/models/requests/update-item-request.model';
import { Item } from 'src/modules/item/models/responses/item';
import { EndpointsService } from '../../app/services/endpoints.service';
import { ItemEndpoints } from '../../shared/models/endpoints/item-endpoints.config';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NetworkService } from '../../shared/services/network.service';

@Injectable()
export class ItemService extends NetworkService<ItemEndpoints> {

  selectedItemId = "";
  _isCreatingItem = false;

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected eventBus: EventBusService) {
    super(http, endpointsService, eventBus);
    this.endpointsModel = this.endpointsService.getItem();
  }

  createItem(form: FormGroup) {
    const model = this.form2CreateItemRequest(form);

    return this.http.post(this.base_path + this.endpointsModel.create, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  updateItem(form: FormGroup) {
    let model = this.form2UpdateItemRequest(form);

    return this.http.patch(this.base_path + this.endpointsModel.update, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  deleteItem(itemId: string) {
    const options = this.formatContentToRequestBody({
      itemId
    });

    return this.http.delete(this.base_path + this.endpointsModel.delete, options).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  getItem(itemId: string) {
    const params = this.getQueryParamsFromObject({
      itemId
    });

    return this.http.get<Item>(this.base_path + this.endpointsModel.get, { params }).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  listItems(searchString: string = "") {
    const params = this.getQueryParamsFromObject({
      searchString
    });
    
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

  get isCreatingNewItem() {
    return this._isCreatingItem;
  }

  set isCreatingNewItem(state: boolean) {
    this._isCreatingItem = state;
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
