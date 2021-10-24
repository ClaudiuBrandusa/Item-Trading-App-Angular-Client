import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { RefreshTokenService } from './modules/identity/services/refresh-token.service';
import { EventBusService } from './modules/shared/services/event-bus.service';
import { interval } from "rxjs";
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Item Trading App';

  isLoggedId = false;

  silentRefresh: Subscription;

  eventBusSub?: Subscription;
  eventBusSilentRefreshSub?: Subscription;

  constructor(private eventBusService: EventBusService, private tokenService: RefreshTokenService) {}
  
  ngOnInit() {
    this.initEventBusSubscriptions();
  }
  
  ngOnDestroy(): void {
    this.clearEventBusSubscriptions();
  }

  private initEventBusSubscriptions() {
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });

    this.eventBusSilentRefreshSub = this.eventBusService.on("silentRefresh", async () => {
      this.startSilentRefresh();
    });
}

  private clearEventBusSubscriptions() {
    if(this.eventBusSub) {
      this.eventBusSub.unsubscribe();
    }
    if(this.eventBusSilentRefreshSub) {
      this.eventBusSilentRefreshSub.unsubscribe();
    }
  }

  logout() {
    this.silentRefresh.unsubscribe();
    this.tokenService.signOut();
  }
  
  startSilentRefresh() {
    this.silentRefresh = interval(5 * 1000)
    .subscribe(() => {
      this.tokenService.refreshTokens()
    });
  }
}
