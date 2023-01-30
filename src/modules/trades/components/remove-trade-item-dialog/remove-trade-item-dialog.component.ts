import { Component } from '@angular/core';
import { BaseNavigableDialogComponent } from '../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { DialogEvents } from '../../../shared/enums/dialog-events.enum';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeDialogsEvents } from '../../enums/trade-dialogs-events';
import { TradeItemEvents } from '../../enums/trade-item-events';
import { TradesService } from '../../services/trades.service';

@Component({
  selector: 'dialog-remove-trade-item',
  templateUrl: './remove-trade-item-dialog.component.html',
  styleUrls: ['./remove-trade-item-dialog.component.css']
})
export class RemoveTradeItemDialogComponent extends BaseNavigableDialogComponent {

  constructor(protected eventBus: EventBusService, private service: TradesService) {
    super(eventBus);
    this.eventId = TradeDialogsEvents.RemoveItem;
  }

  confirm() {
    const currentTradeItemId = this.service.getCurrentTradeItem().id;
    this.deselect();
    this.service.setCurrentTradeItem(null);
    this.service.removeItemByIdFromTradeOffer(currentTradeItemId);
    this.emit(TradeItemEvents.Remove, currentTradeItemId);
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
    this.emit(DialogEvents.ClosePopup, this.eventId);
  }
}
