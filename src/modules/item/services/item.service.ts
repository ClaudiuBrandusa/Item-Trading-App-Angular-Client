import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { CreateItemRequest } from 'src/modules/item/models/requests/create-item-request.model';
import { UpdateItemRequest } from 'src/modules/item/models/requests/update-item-request.model';
import { Item } from 'src/modules/item/models/responses/item';
import { EndpointsService } from '../../app/services/endpoints.service';
import { ItemEndpoints } from '../../shared/models/endpoints/item-endpoints.config';
import { NetworkService } from '../../shared/services/network.service';

@Injectable()
export class ItemService extends NetworkService<ItemEndpoints> {

  constructor(private http: HttpClient, protected endpointsService: EndpointsService) {
    super(endpointsService);
    this.endpointsModel = this.endpointsService.getItem();
  }

  createItem(model: CreateItemRequest) {
    return this.http.post(this.base_path + this.endpointsModel.create, model).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  updateItem(model: UpdateItemRequest) {
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

  listTradesUsingTheItem(itemId: string) {
    const params = this.getQueryParamsFromObject({
      itemId
    });

    return this.http.get<any>(this.base_path + this.endpointsModel.list_trades_using_the_item, { params }).pipe(catchError((error) => (this.buildError(error))));
  }
}
