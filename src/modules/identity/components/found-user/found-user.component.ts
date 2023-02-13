import { Component, OnDestroy } from '@angular/core';
import { ListItemDirective } from 'src/modules/shared/directives/list/list-item/list-item.directive';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { FoundUserResponse } from '../../models/responses/found-user.response';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-found-user',
  templateUrl: './found-user.component.html',
  styleUrls: ['./found-user.component.css']
})
export class FoundUserComponent extends ListItemDirective implements OnDestroy {

  foundUser: FoundUserResponse = new FoundUserResponse();
  private eventBusUtility: EventBusUtils;
  
  constructor(private service: UserService, private eventBus: EventBusService) {
    super();
    this.eventBusUtility = new EventBusUtils(eventBus);
  }

  protected override onSetItemId() {
  }

  protected override loadData() {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  getUser() {
    this.service.getUsername(this.itemId).subscribe({
      next: (response) => {
        const foundUser = response as FoundUserResponse;
        if (foundUser) {
          this.foundUser = foundUser
        }
      },
      error: (error) => {
        console.log(`Error at loading user data for id ${this.itemId}: `, error)
      }
    })
  }

}
