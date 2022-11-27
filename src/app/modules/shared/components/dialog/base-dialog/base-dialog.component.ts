import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { DialogEvents } from '../../../enums/dialog-events.enum';
import { EventBusService } from '../../../services/event-bus.service';
import { EventBusUtils } from '../../../utils/event-bus.utility';

@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.css']
})
export class BaseDialogComponent implements OnInit, OnDestroy {

  @Output()
  eventId: string;

  isActive = false;

  private eventBusUtility: EventBusUtils;

  constructor(protected eventBus: EventBusService) {
    this.eventBusUtility = new EventBusUtils(eventBus);
  }

  ngOnInit() {
    if(!!!this.eventId) {
      return;
    }

    this.on(`${DialogEvents.Open}/${this.eventId}`, () => {
      this.isActive = true;
      this.onDisplay();
    })
  
    this.on(`${DialogEvents.Exit}/${this.eventId}`, () => {
      if(this.isActive) {
        this.onHide();
        this.isActive = false;
      }
    });
  }  
  
  ngOnDestroy() {
    this.clearSubscriptions();
  }

  // Livecycles
  protected onDisplay() { }

  protected onHide() { }

  // Utils
  protected on(eventId: string, response: (id?) => any, unique: Boolean = true)
  {
    return this.eventBusUtility.on(eventId, response, unique);
  }

  protected emit(eventId: string, value: any) {
    this.eventBusUtility.emit(eventId, value);
  }

  protected unsubscribe(subscriptionId: string) {
    this.eventBusUtility.unsubscribe(subscriptionId);
  }

  protected clearSubscriptions() {
    this.eventBusUtility.clearSubscriptions();
  }

  protected exitDialog() {
    this.emit(`${DialogEvents.Exit}/${this.eventId}`, null);
  }

}
