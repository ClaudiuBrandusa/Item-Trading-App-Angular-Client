import { Component } from '@angular/core';
import { RefreshTokenService } from './modules/identity/services/refresh-token.service';
import { SignalRService } from './modules/shared/services/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Item Trading App';

  constructor(public signalRService: SignalRService, private refreshTokenService: RefreshTokenService) {}

  ngOnInit() {
    if (this.refreshTokenService.isLoggedIn()) {
      this.signalRService.startConnection(this.refreshTokenService.getToken());
      this.signalRService.addConnectListener();
    }
  }
}
