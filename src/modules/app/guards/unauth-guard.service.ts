import { inject } from '@angular/core';
import { NavigationService } from '../../shared/services/navigation.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { EventData } from '../../shared/utils/event-data';
import { PageEvents } from '../../shared/enums/page-events.enum';
import { Store } from '@ngrx/store';
import { selectConnected } from '../../identity/store/identity/identity.selector';
import { map, take } from 'rxjs';
import { RefreshTokenService } from '../../identity/services/refresh-token.service';

export const unauthGuard = () => {
  const navigationService = inject(NavigationService);
  const tokenService = inject(RefreshTokenService);
  const store = inject(Store);
  const eventBus = inject(EventBusService);

  return store.select(selectConnected).pipe(
    take(1),
    map(connected => {
      if (connected || tokenService.canRefreshTokens()) {
        eventBus.emit(new EventData(`${PageEvents.Open}/`, null));
        navigationService.redirect("");
        return false;
      }

      return true;
    })
  );
}
