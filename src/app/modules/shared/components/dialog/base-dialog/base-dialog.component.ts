import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventData } from 'src/app/models/utils/event';
import { DialogEventsId } from '../../../enums/dialog-events-id.enum';
import { EventBusService } from '../../../services/event-bus.service';

@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.css']
})
export class BaseDialogComponent implements OnInit, OnDestroy {

  onHideSubscription: Subscription;

  constructor(protected eventBus: EventBusService) { }

  // 

  ngOnInit() {
    if(!this.onHideSubscription) {
      this.on(DialogEventsId.Exit, () => {
        this.onHide();
      });
    }
  }  
  
  ngOnDestroy() {
    this.unsubscribe(this.onHideSubscription);
  }

  // Livecycles
  protected onHide() { }

  // Utils
  protected on(eventId: string, response: () => any)
  {
    return this.eventBus.on(eventId, response);
  }

  protected emit(eventId: string, value: any) {
    this.eventBus.emit(new EventData(eventId, value));
  }

  protected unsubscribe(subscription: Subscription) {
    if(subscription == null)
      return;

    subscription.unsubscribe();
    subscription = null;
  }

  protected exitDialog() {
    this.emit(DialogEventsId.Exit, null);
  }

}
