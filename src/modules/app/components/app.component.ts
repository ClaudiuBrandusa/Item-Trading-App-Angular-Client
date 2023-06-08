import { Component, ComponentRef, ViewChild } from '@angular/core';
import { EventBusService } from '../../shared/services/event-bus.service';
import { EventBusUtils } from '../../shared/utils/event-bus.utility';
import { ModalConfig } from '../models/modal-config';
import { SetTradeItemQuantityAndPriceDialogComponent } from '../../trades/components/set-trade-item-quantity-and-price-dialog/set-trade-item-quantity-and-price-dialog.component';
import { ViewReferenceDirective } from '../directives/view-reference.directive';
import { TradePopupsNames } from '../../trades/enums/trade-popups-names';
import { RemoveTradeItemPopupComponent } from '../../trades/components/remove-trade-item-popup/remove-trade-item-popup.component';
import { NavigationEvents } from '../../shared/enums/navigation-events.enum';

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

  constructor(eventBus: EventBusService) {
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
  }
}
