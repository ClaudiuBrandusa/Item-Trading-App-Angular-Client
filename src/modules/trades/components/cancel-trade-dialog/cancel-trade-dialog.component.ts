import { Component } from '@angular/core';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeEvents } from '../../enums/trade-events';
import { TradeResponse } from '../../enums/trade-response';
import { TradesService } from '../../services/trades.service';
import { CanceledTradeResponse } from '../../models/responses/canceled-trade.response';
import { EventData } from '../../../shared/utils/event-data';
import { NavigationService } from '../../../shared/services/navigation.service';

@Component({
  selector: 'dialog-cancel-trade',
  templateUrl: './cancel-trade-dialog.component.html',
  styleUrls: ['./cancel-trade-dialog.component.css']
})
export class CancelTradeDialogComponent {

  constructor(private eventBus: EventBusService, private service: TradesService, private navigationService: NavigationService) {}

  cancelTrade() {
    const trade = this.service.getSelectedTrade();
    this.service.respondToTradeOffer(trade.tradeId, TradeResponse.Cancel).subscribe({
      next: (response) => {
        const data = response as CanceledTradeResponse;
        this.eventBus.emit(new EventData(TradeEvents.Remove, data.tradeOfferId));
        this.exit();
      },
      error: (error) => {
        console.log(`Error found at cancel trade: ${error}`)
      }
    });
    this.service.deselect();
  }

  exit() {
    this.service.deselect();
    this.navigationService.back();
  }
}
