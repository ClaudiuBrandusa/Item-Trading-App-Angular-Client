import { Component, OnDestroy, OnInit } from '@angular/core';
import { TradeResponse } from '../../enums/trade-response';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { TradeState } from '../../store/trade/trade.state';
import { selectCurrentTradeStatus } from '../../store/trade/trade.selector';
import { CurrentTrade } from '../../models/current-trade';
import { currentTradeSelectionTerminated, respondTradeInit } from '../../store/trade/trade.actions';

@Component({
  selector: 'dialog-respond-trade',
  templateUrl: './respond-trade-dialog.component.html',
  styleUrls: ['./respond-trade-dialog.component.css']
})
export class RespondTradeDialogComponent implements OnInit, OnDestroy {

  private currentTrade: CurrentTrade;

  constructor(private navigationService: NavigationService, private store: Store<TradeState>) {}
  
  ngOnInit() {
    this.store.select(selectCurrentTradeStatus).subscribe(currentTrade => {
      if (!currentTrade) return;
      this.currentTrade = currentTrade;
    });
  }

  ngOnDestroy() {
    this.store.dispatch(currentTradeSelectionTerminated());
  }

  deny() {
    this.respond(false);
  }

  accept() {
    this.respond(true);
  }

  private respond(status: boolean) {
    if (!this.currentTrade) return;
    this.store.dispatch(respondTradeInit(this.currentTrade.tradeId, status ? TradeResponse.Accept : TradeResponse.Reject));
    this.exit();
  }

  exit() {
    this.navigationService.back();
  }
}
