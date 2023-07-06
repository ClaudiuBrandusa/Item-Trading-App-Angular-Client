import { inject } from '@angular/core';
import { map, take } from 'rxjs';
import { NavigationService } from '../../shared/services/navigation.service';
import { InventoryRoutes } from '../enums/inventory-routes';
import { Store } from '@ngrx/store';
import { selectCurrentItemStatus } from '../../item/store/item.selector';
import { Item } from '../../item/models/responses/item';

export const shouldSelectItemGuard = () => {
  const navigationService = inject(NavigationService);
  const store = inject(Store<Item>);

  return store.select(selectCurrentItemStatus).pipe(
    take(1),
    map(lastValue => {
      if (lastValue) {
        navigationService.redirect(InventoryRoutes.Base);
        return false;
      }
      return true;
    })
  );
}