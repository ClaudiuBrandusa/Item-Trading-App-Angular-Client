import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { InventoryService } from "../../services/inventory.service";
import { addItem, addItemSucceeded, dropItem, dropItemSucceeded, loadItemInit, loadItemSucceeded, loadItemsInit, loadItemsSucceeded } from "./inventory.actions";
import { catchError, concatMap, exhaustMap, filter, map, mergeMap, of } from "rxjs";
import { InventoryItem } from "../../models/responses/inventory-item";
import { changedNotification, deletedNotification, handleDefaultException } from "../../../shared/store/notification/notification.actions";
import { NotificationCategoryTypes } from "../../../shared/enums/notification-category-types.enum";

export const loadInventoryItems = createEffect(
  (actions$ = inject(Actions), service = inject(InventoryService)) => {
    return actions$.pipe(
      ofType(loadItemsInit),
      exhaustMap(({ searchString }) =>
        service.list(searchString).pipe(
          map((response: any) =>
            loadItemsSucceeded(response.itemsId)
          ),
          catchError(error =>
            of(handleDefaultException('Error found at list items', error))
          )
        )  
      )
    )
  },
  { functional: true }
);

export const loadInventoryItem = createEffect(
  (actions$ = inject(Actions), service = inject(InventoryService)) => {
    return actions$.pipe(
      ofType(loadItemInit),
      concatMap(({ itemId }) =>
        service.getItem(itemId).pipe(
          map((response) =>
            loadItemSucceeded(response)
          ),
          catchError(error =>
            of(handleDefaultException('Error found at load item', error))
          )
        )
      )
    )
  },
  { functional: true }
)

export const addInventoryItem = createEffect(
  (actions$ = inject(Actions), service = inject(InventoryService)) => {
    return actions$.pipe(
      ofType(addItem),
      exhaustMap(({ request }) =>
        service.addItem(request).pipe(
          map((response: any) =>
            addItemSucceeded(response as InventoryItem)),
          catchError(error =>
            of(handleDefaultException('Error found at add item', error))
          )
        )
      )
    )
  },
  { functional: true }
)

export const dropInventoryItem = createEffect(
  (actions$ = inject(Actions), service = inject(InventoryService)) => {
    return actions$.pipe(
      ofType(dropItem),
      exhaustMap(({ request }) =>
        service.dropItem(request).pipe(
          map((response: any) =>
            dropItemSucceeded(response)
          ),
          catchError(error =>
            of(handleDefaultException('Error found at drop item', error))
          )
        )
      )
    )
  },
  { functional: true }
);

// notification effects

export const changedNotificationEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(changedNotification),
      map(action => action.notification),
      filter(notification => notification.category == NotificationCategoryTypes.Inventory),
      exhaustMap(( notification: any ) => {
          const customData =
          {
            itemId: notification.id,
            quantity: notification.customData.amount
          } as InventoryItem;
          
          if (notification.customData.addAmount as boolean) {
            return of(addItemSucceeded(customData));
          } else {
            return of(dropItemSucceeded(customData));
          }
        }
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
      filter(notification => notification.category == NotificationCategoryTypes.Inventory),
      mergeMap(( notification: any ) =>
        of(dropItemSucceeded({ itemId: notification.id, quantity: 0 }))
      )
    )
  },
  { functional: true }
);
