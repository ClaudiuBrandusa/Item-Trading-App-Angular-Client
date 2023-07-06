import { Component, Input, OnInit } from '@angular/core';
import { Trade } from '../../models/responses/trade';
import { getTradeReceiverOrSender } from '../../utils/trade-utils';
import { NavigationService } from '../../../shared/services/navigation.service';
import { TradeRoutes } from '../../enums/trade-routes';
import { Store } from '@ngrx/store';
import { currentTradeSelectionInitiated, loadTradeInit } from '../../store/trade/trade.actions';
import { selectTradeById } from '../../store/trade/trade.selector';
import { Observable, map } from 'rxjs';
import { TradeItem } from '../../models/trade-item';
import { addTradeItems } from '../../store/trade-item/trade-item.actions';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {

  totalPrice: number = 0;
  trade: Trade;
  trade$: Observable<Trade>;

  @Input()
  tradeId: string;

  @Input()
  isSentTrade: boolean;
  
  @Input()
  isRespondedTrade: boolean;

  response: string;
  userId: string;
  respondedButtonClass: string;
  private baseRespondedButtonClass = "p-2 color-white no-select cursor-pointer";

  constructor(private navigationService: NavigationService, private store: Store<Trade>, private tradeItemStore: Store<TradeItem>) {}
  
  ngOnInit() {
    this.trade$ = this.store.select(selectTradeById(this.tradeId)).pipe(map(trade => {
      if (!trade) return new Trade();
      this.trade = trade;
      this.userId = getTradeReceiverOrSender(trade);
      this.totalPrice = 0;
      trade.items.forEach(item => this.totalPrice += item.price);
      if (trade.response != null) {
        this.isRespondedTrade = true;
        this.handleTradeResponse();
      }
      return trade;
    }));

    this.trade$.subscribe();

    this.getTrade();
  }

  getTrade() {
    this.store.dispatch(loadTradeInit(this.tradeId, this.isSentTrade, this.isRespondedTrade));
  }

  respond() {
    this.select();
    this.openDialog(TradeRoutes.Respond);
  }

  cancel() {
    this.select();
    this.openDialog(TradeRoutes.Cancel);
  }

  details() {
    this.select();
    this.openDialog(TradeRoutes.Details);
  }

  private select() {
    this.store.dispatch(currentTradeSelectionInitiated(this.trade.tradeId, this.trade.items, this.isSentTrade, this.isRespondedTrade));
    this.tradeItemStore.dispatch(addTradeItems(this.trade.items));
  }

  private openDialog(dialog: string) {
    this.navigationService.navigate(dialog, true);
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
}
