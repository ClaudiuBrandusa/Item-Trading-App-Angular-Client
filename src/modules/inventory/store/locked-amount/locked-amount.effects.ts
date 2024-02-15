import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, map, of } from "rxjs";
import { loadInventoryItemLockedAmountInit, loadInventoryItemLockedAmountSucceeded } from "./locked-amount.actions";
import { InventoryService } from "../../services/inventory.service";
import { LockedInventoryItemAmount } from "../../models/responses/locked-inventory-item-amount.response";
import { handleDefaultException } from "../../../notification/store/notification.actions";

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
            of(handleDefaultException(`Error found at loading the locked amount for item with id '${itemId}'`, error))
          )
        )
      )
    )
  },
  { functional: true }
);
