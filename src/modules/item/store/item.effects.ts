import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ItemService } from "../services/item.service";
import { createItemRequestSent, createItemSucceeded, deleteItemInitiated, deleteItemSucceeded, loadItemInitiated, loadItemSucceeded, loadItemsInitiated, loadItemsSucceeded, updateItemInit, updateItemSucceeded } from "./item.actions";
import { catchError, concatMap, exhaustMap, filter, map, mergeMap, of } from "rxjs";
import { NavigationService } from "../../shared/services/navigation.service";
import { CreateItemRequest } from 'src/modules/item/models/requests/create-item-request.model';
import { UpdateItemRequest } from 'src/modules/item/models/requests/update-item-request.model';
import { ItemUpdated } from '../models/responses/item-updated';
import { Item } from "../models/responses/item";
import { changedNotification, createdNotification, deletedNotification, handleDefaultException } from "../../shared/store/notification/notification.actions";
import { NotificationCategoryTypes } from "../../shared/enums/notification-category-types.enum";

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
            of(handleDefaultException('Error found at list item', error))
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
            of(handleDefaultException(`Error at loading item data for id ${itemId}`, error))
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
            of(handleDefaultException('Error at create item found', error))
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
            of(handleDefaultException('Error at update item found', error))
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
            of(handleDefaultException('Error at delete item found', error))
          )
        )
      )
    )
  },
  { functional: true }
);

// notification effects

export const createdNotificationEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(createdNotification),
      map(action => action.notification),
      filter(notification => notification.category == NotificationCategoryTypes.Item),
      mergeMap(( notification: any ) =>
        of(createItemSucceeded(notification.id))
      )
    )
  },
  { functional: true }
);

export const changedNotificationEffect = createEffect(
  (actions$ = inject(Actions), service = inject(ItemService)) => {
    return actions$.pipe(
      ofType(changedNotification),
      map(action => action.notification),
      filter(notification => notification.category == NotificationCategoryTypes.Item),
      mergeMap(( notification: any ) =>
        service.getItem(notification.id).pipe(
          map((response) => updateItemSucceeded(response)
          ),
          catchError(error =>
            of(handleDefaultException(`Error at loading item data for id ${notification.id}`, error))
          )
        )
      )
    )
  },
  { functional: true }
);

export const deletedNotificationEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(deletedNotification),
      map(action => action.notification),
      filter(notification => notification.category == NotificationCategoryTypes.Item),
      mergeMap(( notification: any ) =>
        of(deleteItemSucceeded(notification.id))
      )
    )
  },
  { functional: true }
);