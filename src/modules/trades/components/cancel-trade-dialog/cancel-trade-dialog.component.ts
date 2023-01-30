import { Component } from '@angular/core';
import { BaseNavigableDialogComponent } from '../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeDialogsEvents } from '../../enums/trade-dialogs-events';
import { TradeEvents } from '../../enums/trade-events';
import { TradeResponse } from '../../enums/trade-response';
import { TradesService } from '../../services/trades.service';
import { CanceledTradeResponse } from '../../models/responses/canceled-trade.response';

@Component({
  selector: 'dialog-cancel-trade',
  templateUrl: './cancel-trade-dialog.component.html',
  styleUrls: ['./cancel-trade-dialog.component.css']
})
export class CancelTradeDialogComponent extends BaseNavigableDialogComponent {

  constructor(protected eventBus: EventBusService, private service: TradesService) {
    super(eventBus);
    this.eventId = TradeDialogsEvents.Cancel;
  }

  async cancelTrade() {
    const trade = this.service.getSelectedTrade();
    (await this.service.respondToTradeOffer(trade.tradeId, TradeResponse.Cancel)).subscribe({
      next: (response) => {
        const data = response as CanceledTradeResponse;
        this.emit(TradeEvents.Remove, data.tradeOfferId);
        this.exitDialog();
      },
      error: (error) => {
        console.log(`Error found at cancel trade: ${error}`)
      }
    });
    this.service.deselect();
  }

  exit() {
    this.service.deselect();
  }
}