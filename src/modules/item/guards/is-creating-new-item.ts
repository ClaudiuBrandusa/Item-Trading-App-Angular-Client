import { inject } from "@angular/core";
import { map, take } from "rxjs";
import { NavigationService } from "../../shared/services/navigation.service";
import { ItemRoutes } from "../enums/item-routes";
import { Store } from "@ngrx/store";
import { selectItemCreationStatus } from "../store/item.selector";
import { Item } from "../models/responses/item";

export const isCreatingNewItemGuard = () => {
  const navigationService = inject(NavigationService);
  const store = inject(Store<Item>);

  return store.select(selectItemCreationStatus).pipe(
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