import { Component } from '@angular/core';
import { UserService } from '../../../identity/services/user.service';
import { BaseNavigableDialogComponent } from '../../../shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { TradeDialogsEvents } from '../../enums/trade-dialogs-events';
import { TradesService } from '../../services/trades.service';
import { FoundUsersResponse } from '../../models/responses/found-users.response'

@Component({
  selector: 'dialog-select-trade-receiver',
  templateUrl: './select-trade-receiver-dialog.component.html',
  styleUrls: ['./select-trade-receiver-dialog.component.css']
})
export class SelectTradeReceiverDialogComponent extends BaseNavigableDialogComponent {

  foundUsersId = new Array<string>();
  searchString : string = "";
  nextDialogId = TradeDialogsEvents.SelectItems;

  constructor(protected eventBus: EventBusService, private service: TradesService, private userService: UserService) {
    super(eventBus);
    this.eventId = TradeDialogsEvents.SelectReceiver;
  }

  select(userId: string) {
    this.service.setTradeOfferReceiver(userId);
    this.navigate(this.nextDialogId);
  }

  cancel() {
    this.clearResults();
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

  private clearResults() {
    while(this.foundUsersId.length > 0)
      this.foundUsersId.pop();
  }

  protected override onHide() {
    this.clearResults();
    this.searchString = '';
  }

  private listItems() {
    this.userService.listUsers(this.searchString).subscribe({
      next: (response) => {
        const foundUsers = response as FoundUsersResponse;
        if (foundUsers) {
          foundUsers.usersId.forEach(foundUserId => this.foundUsersId.push(foundUserId));
        }
      },
      error: (error) => {
        console.log('Error found at list users: ', error);
      }
    })
  }
}
