import { Component } from '@angular/core';
import { BaseNavigableDialogComponent } from '../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeDialogsEvents } from '../../enums/trade-dialogs-events';
import { TradeResponse } from '../../enums/trade-response';
import { TradesService } from '../../services/trades.service';
import { RespondedTradeResponse } from '../../models/responses/responded-trade.response';
import { TradeEvents } from '../../enums/trade-events';

@Component({
  selector: 'dialog-respond-trade',
  templateUrl: './respond-trade-dialog.component.html',
  styleUrls: ['./respond-trade-dialog.component.css']
})
export class RespondTradeDialogComponent extends BaseNavigableDialogComponent {

  constructor(protected eventBus: EventBusService, private service: TradesService) {
    super(eventBus);
    this.eventId = TradeDialogsEvents.Respond;
  }

  deny() {
    this.respond(false);
  }

  accept() {
    this.respond(true);
  }

  private respond(status: boolean) {
    const currentTrade = this.service.getSelectedTrade();
    const response = status ? TradeResponse.Accept : TradeResponse.Reject;
    this.service.respondToTradeOffer(currentTrade.tradeId, response).subscribe({
      next: (responseBody) => {
        const data = responseBody as RespondedTradeResponse
        this.emit(TradeEvents.Update+data.tradeOfferId, response);
      },
      error: (error) => {
        console.log(`Error found on responding to trade: ${error}`);
      },
      complete: () => {
        this.exitDialog();
      }
    });
  }
}
