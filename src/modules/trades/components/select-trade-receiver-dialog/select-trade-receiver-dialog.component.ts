import { Component } from '@angular/core';
import { UserService } from '../../../identity/services/user.service';
import { TradesService } from '../../services/trades.service';
import { FoundUsersResponse } from '../../models/responses/found-users.response'
import { NavigationService } from '../../../shared/services/navigation.service';
import { TradeRoutes } from '../../enums/trade-routes';

@Component({
  selector: 'dialog-select-trade-receiver',
  templateUrl: './select-trade-receiver-dialog.component.html',
  styleUrls: ['./select-trade-receiver-dialog.component.css']
})
export class SelectTradeReceiverDialogComponent {

  foundUsersId = new Array<string>();
  searchString : string = "";

  constructor(private navigationService: NavigationService, private service: TradesService, private userService: UserService) {}

  async select(userId: string) {
    this.service.setTradeOfferReceiver(userId);
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
    this.navigationService.back();
  }

  private clearResults() {
    while(this.foundUsersId.length > 0)
      this.foundUsersId.pop();
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
