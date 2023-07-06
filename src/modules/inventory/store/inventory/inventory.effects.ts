import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { InventoryService } from "../../services/inventory.service";
import { addItem, addItemSucceeded, defaultItemFailedResponse, dropItem, dropItemSucceeded, loadItemInit, loadItemSucceeded, loadItemsInit, loadItemsSucceeded } from "./inventory.actions";
import { catchError, concatMap, exhaustMap, map, of, tap } from "rxjs";
import { DefaultException } from "../../../shared/models/errors/default-exception";
import { InventoryItem } from "../../models/responses/inventory-item";

export const loadInventoryItems = createEffect(
  (actions$ = inject(Actions), service = inject(InventoryService)) => {
    return actions$.pipe(
      ofType(loadItemsInit),
      exhaustMap(({ searchString }) =>
        service.list(searchString).pipe(
          map((response: any) => {
            return loadItemsSucceeded(response.itemsId)
          }),
          catchError(error =>
            of(defaultItemFailedResponse('Error found at list items: ', error))
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
          map((response) => {
            return loadItemSucceeded(response)}
          ),
          catchError(error =>
            of(defaultItemFailedResponse('Error found at load item: ', error))
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
            of(defaultItemFailedResponse('Error found at add item: ', error))
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
            of(defaultItemFailedResponse('Error found at drop item: ', error))
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