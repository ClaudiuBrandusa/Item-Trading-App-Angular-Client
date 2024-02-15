import { inject } from '@angular/core';
import { NavigationService } from '../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { selectConnected } from '../../identity/store/identity/identity.selector';
import { map, take } from 'rxjs';
import { RefreshTokenService } from '../../identity/services/refresh-token.service';
import { connected } from '../../identity/store/identity/identity.actions';

export const authGuard = () => {
  const navigationService = inject(NavigationService);
  const tokenService = inject(RefreshTokenService);
  const store = inject(Store);

  return store.select(selectConnected).pipe(
    take(1),
    map(isConnected => {
      if (isConnected) {
        return true;
      } else if (tokenService.canRefreshTokens()) {
        store.dispatch(connected());
        return true
      }

      tokenService.discardData();
      navigationService.redirect("login");
      return false;
    })
  );
}
