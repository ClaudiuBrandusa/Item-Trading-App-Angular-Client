import { Component } from '@angular/core';
import { BaseDialogComponent } from 'src/modules/shared/components/dialog/base-dialog/base-dialog.component';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeDialogsEvents } from '../../enums/trade-dialogs-events';
import { Trade } from '../../models/responses/trade';
import { TradesService } from '../../services/trades.service';
import { getTradeReceiverOrSender, getTradeTotalPrice } from '../../utils/trade-utils';

@Component({
  selector: 'dialog-trade-details',
  templateUrl: './trade-details-dialog.component.html',
  styleUrls: ['./trade-details-dialog.component.css']
})
export class TradeDetailsDialogComponent extends BaseDialogComponent {

  trade: Trade;
  isSentTrade: boolean;
  userId: string;
  totalPrice: number;
  loading = true;

  constructor(protected eventBus: EventBusService, private service: TradesService) {
    super(eventBus);
    this.eventId = TradeDialogsEvents.Details;
  }

  protected override onDisplay() {
    this.service.getCurrentTrade().subscribe({
      next: (response) => {
        this.trade = response as Trade;
        this.isSentTrade = this.service.isSentTrade(this.trade.tradeId);
        this.userId = getTradeReceiverOrSender(this.trade);
        this.totalPrice = getTradeTotalPrice(this.trade);
        this.service.select(this.trade.tradeId, this.trade.items);
      },
      error: (error) => {
        console.log('Error at get trade: ', error);
      },
      complete: () => {
        this.loading = false;
      }
    })
  }
  
  protected override onHide() {
    this.service.deselect();
    this.loading = true;
  }

  exit() {
    this.exitDialog();
  }
}
