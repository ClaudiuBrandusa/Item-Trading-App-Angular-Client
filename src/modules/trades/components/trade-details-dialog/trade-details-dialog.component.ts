import { Component, OnInit } from '@angular/core';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { Trade } from '../../models/responses/trade';
import { TradesService } from '../../services/trades.service';
import { getTradeReceiverOrSender, getTradeTotalPrice } from '../../utils/trade-utils';
import { NavigationService } from '../../../shared/services/navigation.service';

@Component({
  selector: 'dialog-trade-details',
  templateUrl: './trade-details-dialog.component.html',
  styleUrls: ['./trade-details-dialog.component.css']
})
export class TradeDetailsDialogComponent implements OnInit {

  trade: Trade;
  isSentTrade: boolean;
  userId: string;
  totalPrice: number;
  loading = true;

  constructor(protected eventBus: EventBusService, private service: TradesService, private navigationService: NavigationService) {}
  
  ngOnInit() {
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

  exit() {
    this.service.deselect();
    this.navigationService.back();
  }
}
