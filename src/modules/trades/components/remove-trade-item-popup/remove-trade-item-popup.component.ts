import { Component } from '@angular/core';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeItemEvents } from '../../enums/trade-item-events';
import { TradesService } from '../../services/trades.service';
import { NavigationService } from '../../../shared/services/navigation.service';
import { EventData } from '../../../shared/utils/event-data';

@Component({
  selector: 'popup-remove-trade-item',
  templateUrl: './remove-trade-item-popup.component.html',
  styleUrls: ['./remove-trade-item-popup.component.css']
})
export class RemoveTradeItemPopupComponent {

  constructor(protected eventBus: EventBusService, private service: TradesService, private navigationService: NavigationService) {}

  confirm() {
    const currentTradeItemId = this.service.getCurrentTradeItem().id;
    this.deselect();
    this.service.setCurrentTradeItem(null);
    this.service.removeItemByIdFromTradeOffer(currentTradeItemId);
    this.eventBus.emit(new EventData(TradeItemEvents.Remove, currentTradeItemId));
    this.closePopup();
  }

  deny() {
    this.deselect();
    this.closePopup();
  }

  private deselect() {
    this.service.setCurrentTradeItem(null);
  }

  private closePopup() {
    this.navigationService.closePopup();
  }
}
