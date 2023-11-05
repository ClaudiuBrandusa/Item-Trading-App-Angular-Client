import { Component, ComponentRef, HostListener, ViewChild } from '@angular/core';
import { EventBusService } from '../../shared/services/event-bus.service';
import { EventBusUtils } from '../../shared/utils/event-bus.utility';
import { ModalConfig } from '../models/modal-config';
import { SetTradeItemQuantityAndPriceDialogComponent } from '../../trades/components/set-trade-item-quantity-and-price-dialog/set-trade-item-quantity-and-price-dialog.component';
import { ViewReferenceDirective } from '../directives/view-reference.directive';
import { TradePopupsNames } from '../../trades/enums/trade-popups-names';
import { RemoveTradeItemPopupComponent } from '../../trades/components/remove-trade-item-popup/remove-trade-item-popup.component';
import { NavigationEvents } from '../../shared/enums/navigation-events.enum';
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

  private eventBusUtility: EventBusUtils
  private modalConfigs: ModalConfig[] = [
    {
      name: TradePopupsNames.SetItemQuantityAndPrice,
      component: SetTradeItemQuantityAndPriceDialogComponent
    },
    {
      name: TradePopupsNames.RemoveItem,
      component: RemoveTradeItemPopupComponent
    }
  ]

  private activeModals = new Map<string, ComponentRef<object>>();

  @ViewChild(ViewReferenceDirective, {static: true}) viewRef!: ViewReferenceDirective;

  constructor(private silentTokenRefreshService: SilentTokenRefreshService, eventBus: EventBusService, private store: Store, private signalRService: SignalRService, private tokenService: RefreshTokenService) {
    this.eventBusUtility = new EventBusUtils(eventBus);
    
    this.eventBusUtility.on(NavigationEvents.OpenAsPopup, (popupName) => {
      const modal = this.modalConfigs.find(config => config.name === popupName);

      if (!modal) return;
      
      this.activeModals.set(popupName, this.viewRef.viewContainerRef.createComponent(modal.component));
    });

    this.eventBusUtility.on(NavigationEvents.ClosePopup, (popupName) => {
      const modal = this.activeModals.get(popupName);
      if (!modal) return;

      modal.destroy();
    });

    this.store.select(selectConnected).subscribe(connected => {
      const token = this.tokenService.getToken();
      if (connected) {
        const currentDate = new Date();
        const expirationDate = this.tokenService.getTokenExpirationDate();
        const duration = expirationDate === null ? 0 : new TimeSpan(expirationDate!.valueOf() - currentDate.valueOf()).milliseconds;

        this.silentTokenRefreshService.start(duration);
        
        this.signalRService.connect(token);
      } else {
        this.silentTokenRefreshService.stop();
        this.signalRService.disconnect(token);
      }
    });
  }
  
  @HostListener('window:beforeunload', ['$event'])
  public beforeUnloadHandler(_$event) {
    const token = this.tokenService.getToken();
    this.store.dispatch(disconnectInit(token, true));
  }
}
