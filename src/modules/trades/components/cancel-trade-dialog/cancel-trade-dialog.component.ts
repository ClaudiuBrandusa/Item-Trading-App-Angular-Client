import { Component, OnDestroy, OnInit } from '@angular/core';
import { TradeResponse } from '../../enums/trade-response';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { TradeState } from '../../store/trade/trade.state';
import { selectCurrentTradeStatus } from '../../store/trade/trade.selector';
import { currentTradeSelectionTerminated, respondTradeInit } from '../../store/trade/trade.actions';

@Component({
  selector: 'dialog-cancel-trade',
  templateUrl: './cancel-trade-dialog.component.html',
  styleUrls: ['./cancel-trade-dialog.component.css']
})
export class CancelTradeDialogComponent implements OnInit, OnDestroy {

  private tradeId: string;

  constructor(private navigationService: NavigationService, private store: Store<TradeState>) {}
  
  ngOnInit() {
    this.store.select(selectCurrentTradeStatus).subscribe(currentTrade => {
      if (!currentTrade) return;
      this.tradeId = currentTrade.tradeId;
    });
  }
  
  ngOnDestroy() {
    this.store.dispatch(currentTradeSelectionTerminated());
  }

  cancelTrade() {
    this.store.dispatch(respondTradeInit(this.tradeId, TradeResponse.Cancel));
    this.exit();
  }

  exit() {
    this.navigationService.back();
  }
}
