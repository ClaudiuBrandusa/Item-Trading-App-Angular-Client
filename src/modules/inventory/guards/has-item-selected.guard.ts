import { inject } from '@angular/core';
import { map, take } from 'rxjs';
import { NavigationService } from '../../shared/services/navigation.service';
import { InventoryRoutes } from '../enums/inventory-routes';
import { Store } from '@ngrx/store';
import { InventoryItem } from '../models/responses/inventory-item';
import { selectCurrentInventoryItemId } from '../store/inventory/inventory.selector';

export const hasItemSelectedGuard = () => {
  const navigationService = inject(NavigationService);
  const store = inject(Store<InventoryItem>);

  return store.select(selectCurrentInventoryItemId).pipe(
    take(1),
    map(lastValue => {
      if (!lastValue) {
        navigationService.redirect(InventoryRoutes.Base);
        return false;
      }
      return true;
    })
  );
}