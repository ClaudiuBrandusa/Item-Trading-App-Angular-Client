import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ItemService } from "../services/item.service";
import { createItemRequestSent, createItemSucceeded, defaultItemFailedResponse, deleteItemInitiated, deleteItemSucceeded, loadItemInitiated, loadItemSucceeded, loadItemsInitiated, loadItemsSucceeded, updateItemInit, updateItemSucceeded } from "./item.actions";
import { catchError, concatMap, exhaustMap, map, of, tap } from "rxjs";
import { NavigationService } from "../../shared/services/navigation.service";
import { CreateItemRequest } from 'src/modules/item/models/requests/create-item-request.model';
import { UpdateItemRequest } from 'src/modules/item/models/requests/update-item-request.model';
import { ItemUpdated } from '../models/responses/item-updated';
import { DefaultException } from '../../shared/models/errors/default-exception';
import { Item } from "../models/responses/item";

export const loadItems = createEffect(
  (actions$ = inject(Actions), service = inject(ItemService)) => {
    return actions$.pipe(
      ofType(loadItemsInitiated),
      exhaustMap(({ searchString }) => 
        service.listItems(searchString).pipe(
          map((response) => {
            return loadItemsSucceeded({ itemIds: response.itemsId });
          }),
          catchError(error =>
            of(defaultItemFailedResponse('Error found at list item: ', error))
          )
        )
      )
    )
  },
  { functional: true }
);

export const loadItem = createEffect(
  (actions$ = inject(Actions), service = inject(ItemService)) => {
    return actions$.pipe(
      ofType(loadItemInitiated),
      concatMap(({ itemId }) =>
        service.getItem(itemId).pipe(
          map((response) => {
            return loadItemSucceeded(response)
          }),
          catchError(error =>
            of(defaultItemFailedResponse(`Error at loading item data for id ${itemId}: `, error))
          )
        )
      )
    )
  },
  { functional: true }
);

export const createItem = createEffect(
  (actions$ = inject(Actions), service = inject(ItemService), navigationService = inject(NavigationService)) => {
    return actions$.pipe(
      ofType(createItemRequestSent),
      exhaustMap((data: CreateItemRequest) => 
        service.createItem(data).pipe(
          map((response) => {
            navigationService.back();
            return createItemSucceeded((response as any).itemId.toString());
          }),
          catchError(error => 
            of(defaultItemFailedResponse('Error at create item found: ', error))
          )
        )
      )
    );
  },
  { functional: true }
);

export const updateItem = createEffect(
  (actions$ = inject(Actions), service = inject(ItemService), navigationService = inject(NavigationService)) => {
    return actions$.pipe(
      ofType(updateItemInit),
      exhaustMap((data: UpdateItemRequest) =>
        service.updateItem(data).pipe(
          map((response: ItemUpdated) => {
            navigationService.back();
            const updatedItem: Item = new Item({ id: response.itemId, name: response.itemName, description: response.itemDescription });
            return updateItemSucceeded(updatedItem)
          }),
          catchError(error =>
            of(defaultItemFailedResponse('Error at update item found: ', error))
          )
        )
      )
    )
  },
  { functional: true }
);

export const deleteItem = createEffect(
  (actions$ = inject(Actions), service = inject(ItemService), navigationService = inject(NavigationService)) => {
    return actions$.pipe(
      ofType(deleteItemInitiated),
      exhaustMap(({ itemId }) =>
        service.deleteItem(itemId).pipe(
          map((_response) => {
            navigationService.back();
            return deleteItemSucceeded(itemId)
          }),
          catchError(error =>
            of(defaultItemFailedResponse('Error at delete item found: ', error))
          )
        )
      )
    )
  },
  { functional: true }
);

export const defaultItemError = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(defaultItemFailedResponse),
      tap((error: DefaultException) => {
        console.log(error.message, error.body)
      })
    );
  },
  { functional: true, dispatch: false }
);