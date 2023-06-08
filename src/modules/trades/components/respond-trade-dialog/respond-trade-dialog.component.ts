import { Component } from '@angular/core';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeResponse } from '../../enums/trade-response';
import { TradesService } from '../../services/trades.service';
import { RespondedTradeResponse } from '../../models/responses/responded-trade.response';
import { TradeEvents } from '../../enums/trade-events';
import { NavigationService } from '../../../shared/services/navigation.service';
import { EventData } from '../../../shared/utils/event-data';

@Component({
  selector: 'dialog-respond-trade',
  templateUrl: './respond-trade-dialog.component.html',
  styleUrls: ['./respond-trade-dialog.component.css']
})
export class RespondTradeDialogComponent {

  constructor(private eventBus: EventBusService, private service: TradesService, private navigationService: NavigationService) {}

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
        this.eventBus.emit(new EventData(TradeEvents.Update+data.tradeOfferId, response));
      },
      error: (error) => {
        console.log(`Error found on responding to trade: ${error}`);
      },
      complete: () => {
        this.exit();
      }
    });
  }

  exit() {
    this.service.deselect();
    this.navigationService.back();
  }
}
