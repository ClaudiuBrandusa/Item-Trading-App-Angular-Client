import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RefreshTokenService } from './modules/identity/services/refresh-token.service';
import { EventBusService } from './modules/shared/services/event-bus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Item Trading App';

  isLoggedId = false;

  eventBusSub?: Subscription;

  constructor(private eventBusService: EventBusService, private tokenService: RefreshTokenService) {}
  
  ngOnInit(): void {
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  ngOnDestroy(): void {
    if(this.eventBusSub) {
      this.eventBusSub.unsubscribe();
    }
  }

  logout() {
    this.tokenService.signOut();
  }
}
