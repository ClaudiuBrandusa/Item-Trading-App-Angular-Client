import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, map, of, tap } from "rxjs";
import { defaultInventoryItemLockedAmountFailedResponse, loadInventoryItemLockedAmountInit, loadInventoryItemLockedAmountSucceeded } from "./locked-amount.actions";
import { DefaultException } from "../../../shared/models/errors/default-exception";
import { InventoryService } from "../../services/inventory.service";
import { LockedInventoryItemAmount } from "../../models/responses/locked-inventory-item-amount.response";

export const loadInventoryItemLockedAmount = createEffect(
  (actions$ = inject(Actions), service = inject(InventoryService)) => {
    return actions$.pipe(
      ofType(loadInventoryItemLockedAmountInit),
      concatMap(({ itemId }) =>
        service.getLockedAmount(itemId).pipe(
          map((response: any) =>
            loadInventoryItemLockedAmountSucceeded(response as LockedInventoryItemAmount)
          ),
          catchError(error =>
            of(defaultInventoryItemLockedAmountFailedResponse(`Error found at loading the locked amount for item with id '${itemId} :'`, error))
          )
        )
      )
    )
  },
  { functional: true }
);

export const defaultInventoryItemLockedAmountError = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(defaultInventoryItemLockedAmountFailedResponse),
      tap((error: DefaultException) => {
        console.log(error.message, error.body)
      })
    );
  },
  { functional: true, dispatch: false }
);