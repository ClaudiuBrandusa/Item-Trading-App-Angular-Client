import { Component } from '@angular/core';
import { NavigationService } from '../../../shared/services/navigation.service';
import { TradeRoutes } from '../../enums/trade-routes';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUsers } from '../../../identity/store/user.selector';
import { FoundUserResponse } from '../../../identity/models/responses/found-user.response';
import { listUsersInit, clearUsersList } from '../../../identity/store/user.actions';
import { Trade } from '../../models/responses/trade';
import { setTradeReceiver } from '../../store/trade/trade.actions';

@Component({
  selector: 'dialog-select-trade-receiver',
  templateUrl: './select-trade-receiver-dialog.component.html',
  styleUrls: ['./select-trade-receiver-dialog.component.css']
})
export class SelectTradeReceiverDialogComponent {
  foundUsersId = new Array<string>();
  searchString : string = "";
  foundUsers$: Observable<FoundUserResponse[]>;

  constructor(private navigationService: NavigationService, private userStore: Store<FoundUserResponse>, private store: Store<Trade>) {
    this.foundUsers$ = userStore.select(selectUsers);
  }

  async select(userId: string) {
    this.store.dispatch(setTradeReceiver(userId));
    await this.navigationService.navigate(`../${TradeRoutes.SelectItems}`, true);
  }

  search() {
    // we are going to use the list method until we implement the search functionality on the API
    this.clearResults();
    
    if(this.searchString == "") {
      // then we just leave it empty
      return;
    }

    this.listItems();
  }

  exit() {
    this.clearResults();
    this.navigationService.back();
  }

  private clearResults() {
    this.userStore.dispatch(clearUsersList());
  }

  private listItems() {
    this.userStore.dispatch(listUsersInit(this.searchString));
  }
}
