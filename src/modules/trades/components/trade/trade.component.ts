import { Component, OnDestroy } from '@angular/core';
import { ListItemDirective } from 'src/modules/shared/directives/list/list-item/list-item.directive';
import { DialogEvents } from '../../../shared/enums/dialog-events.enum';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { TradeDialogsEvents } from '../../enums/trade-dialogs-events';
import { TradeEvents } from '../../enums/trade-events';
import { TradeResponse } from '../../enums/trade-response';
import { Trade } from '../../models/responses/trade';
import { TradesService } from '../../services/trades.service';
import { getTradeReceiverOrSender } from '../../utils/trade-utils';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent extends ListItemDirective implements OnDestroy {

  totalPrice: number = 0;
  trade: Trade;
  isSentTrade: boolean;
  isRespondedTrade: boolean;
  response: string;
  userId: string;
  loading = true;
  respondedButtonClass: string;
  private baseRespondedButtonClass = "p-2 color-white no-select cursor-pointer";
  private eventBusUtility: EventBusUtils;

  constructor(eventBus: EventBusService, private service: TradesService) {
    super();
    this.eventBusUtility = new EventBusUtils(eventBus);
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  protected override onSetItemId() {
    this.isSentTrade = this.service.isSentTrade(this.itemId);
    this.isRespondedTrade = this.service.isRespondedTrade(this.itemId);
    this.initSubscriptions();
  }

  protected override loadData() {
    this.getTrade();
  }

  getTrade() {
    this.service.getTrade(this.itemId).subscribe({
      next: (response) => {
        this.trade = response as Trade;
        this.totalPrice = 0;
        this.trade.items.forEach(item => this.totalPrice += item.price);
        this.userId = getTradeReceiverOrSender(this.trade);
        this.handleTradeResponse();
      },
      error: (error) => {
        console.log(`Error found on get trade with id: ${this.itemId}. ${error}`);
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

  respond() {
    this.select();
    this.openDialog(TradeDialogsEvents.Respond);
  }

  cancel() {
    this.select();
    this.openDialog(TradeDialogsEvents.Cancel);
  }

  details() {
    this.select();
    this.openDialog(TradeDialogsEvents.Details);
  }

  private select() {
    this.service.select(this.trade.tradeId, this.trade.items);
  }

  private openDialog(dialog: string) {
    this.eventBusUtility.emit(DialogEvents.Open, dialog);
  }

  private handleTradeResponse() {
    if (this.trade.response) {
      this.response = "Accepted";
      this.respondedButtonClass = this.baseRespondedButtonClass + " bg-cadet-blue";
    } else {
      this.response = "Rejected";
      this.respondedButtonClass = this.baseRespondedButtonClass + " bg-dark-red";
    }
  }

  // Subscriptions

  private initSubscriptions() {
    this.eventBusUtility.on(TradeEvents.Update+this.itemId, (response: TradeResponse) => {
      this.trade.response = response == TradeResponse.Accept ? true : false;
      this.service.cacheTrade(this.itemId, false, true);
      this.handleTradeResponse();
      this.eventBusUtility.emit(TradeEvents.Update, this.itemId);
    })
  }
}
