import { Component, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectConnected } from '../../identity/store/identity/identity.selector';
import { SignalRService } from '../../shared/services/signal-r.service';
import { RefreshTokenService } from '../../identity/services/refresh-token.service';
import { disconnectInit } from '../../identity/store/identity/identity.actions';
import { SilentTokenRefreshService } from '../../identity/services/silent-token-refresh.service';
import { TimeSpan } from '../../shared/utils/time-span';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Item Trading App';

  constructor(private silentTokenRefreshService: SilentTokenRefreshService, private store: Store, private signalRService: SignalRService, private tokenService: RefreshTokenService) {

    this.store.select(selectConnected).subscribe(connected => {
      const token = this.tokenService.getToken();
      if (connected) {
        const duration = this.getDuration();

        this.silentTokenRefreshService.start(duration);
        
        this.signalRService.connect(token);
      } else {
        this.silentTokenRefreshService.stop();
        this.signalRService.disconnect();
      }
    });
  }

  private getDuration() {
    const currentDate = new Date();
    const expirationDate = this.tokenService.getTokenExpirationDate();

    return expirationDate === null ? 0 : new TimeSpan(expirationDate!.valueOf() - currentDate.valueOf()).milliseconds;
  }
  
  @HostListener('window:beforeunload', ['$event'])
  public beforeUnloadHandler(_$event) {
    this.store.dispatch(disconnectInit(true));
  }
}
