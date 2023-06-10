import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RefreshTokenService } from 'src/modules/identity/services/refresh-token.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { EventData } from '../../shared/utils/event-data';
import { PageEvents } from '../../shared/enums/page-events.enum';

@Injectable()
export class UnauthGuardService implements CanActivate {

  constructor(private navigationService: NavigationService, private eventBus: EventBusService, private refreshTokenService: RefreshTokenService) { }

  canActivate() {  
    if(this.refreshTokenService.isLoggedIn()) {
      // return to the index page
      this.eventBus.emit(new EventData(`${PageEvents.Open}/`, null));
      this.navigationService.redirect("");
      return false;
    }
    
    return true;
  }
}
