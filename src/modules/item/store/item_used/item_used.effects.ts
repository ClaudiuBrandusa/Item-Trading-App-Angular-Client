import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ItemService } from "../../services/item.service";
import { loadTradesUsingTheItemInit, loadTradesUsingTheItemSucceeded } from "./item_used.actions";
import { catchError, map, mergeMap, of } from "rxjs";
import { ItemTrades } from "../../models/item-trades";
import { handleDefaultException } from "../../../notification/store/notification.actions";

export const loadTradesUsingTheItem = createEffect(
  (actions$ = inject(Actions), service = inject(ItemService)) => {
    return actions$.pipe(
      ofType(loadTradesUsingTheItemInit),
      mergeMap(({ itemId }) =>
        service.listTradesUsingTheItem(itemId).pipe(
          map((response) => {
            return loadTradesUsingTheItemSucceeded(response as ItemTrades)
          }),
          catchError(error =>
            of(handleDefaultException('Error found when listing the trades using the item', error))
          )
        )
      )
    )
  },
  { functional: true }
);