import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventData } from 'src/app/models/utils/event';
import { DialogEvents } from '../../../enums/dialog-events.enum';
import { EventBusService } from '../../../services/event-bus.service';

@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.css']
})
export class BaseDialogComponent implements OnInit, OnDestroy {

  @Output()
  eventId: string;

  isActive = false;

  onDisplaySubscription: Subscription;
  onHideSubscription: Subscription;

  constructor(protected eventBus: EventBusService) { }

  ngOnInit() {
    if(!!!this.eventId) {
      return;
    }

    if(!this.onDisplaySubscription) {
      this.onDisplaySubscription = this.on(`${DialogEvents.Open}/${this.eventId}`, () => {
        this.isActive = true;
        this.onDisplay();
      })
    }
    
    if(!this.onHideSubscription) {
      this.onHideSubscription = this.on(`${DialogEvents.Exit}/${this.eventId}`, () => {
        if(this.isActive) {
          this.onHide();
          this.isActive = false;
        }
      });
    }
  }  
  
  ngOnDestroy() {
    this.clearOnHideSubscription();
    this.clearOnDisplaySubscription();
  }

  private clearOnDisplaySubscription() {
    this.unsubscribe(this.onDisplaySubscription);
    this.onDisplaySubscription = null;
  }

  private clearOnHideSubscription() {
    this.unsubscribe(this.onHideSubscription);
    this.onHideSubscription = null;
  }

  // Livecycles
  protected onDisplay() { }

  protected onHide() { }

  // Utils
  protected on(eventId: string, response: (id?) => any)
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
    this.emit(`${DialogEvents.Exit}/${this.eventId}`, null);
  }

}
