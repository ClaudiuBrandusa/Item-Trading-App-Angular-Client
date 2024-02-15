import { inject } from "@angular/core";
import { ItemRoutes } from "../enums/item-routes";
import { NavigationService } from "../../shared/services/navigation.service";
import { map, take } from "rxjs";
import { Store } from "@ngrx/store";
import { selectCurrentItemStatus } from "../store/item/item.selector";
import { Item } from "../models/responses/item";

export const hasItemSelectedGuard = () => {
  const navigationService = inject(NavigationService);
  const store = inject(Store<Item>);

  return store.select(selectCurrentItemStatus).pipe(
    take(1),
    map(lastValue => {
      if (!lastValue) {
        navigationService.redirect(ItemRoutes.Base);
        return false;
      }
      return true;
    })
  );
}