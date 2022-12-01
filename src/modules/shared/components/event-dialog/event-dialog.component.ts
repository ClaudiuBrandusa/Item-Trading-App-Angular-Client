import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DialogEvents } from '../../enums/dialog-events.enum';
import { EventBusService } from '../../services/event-bus.service';
import { EventBusUtils } from '../../utils/event-bus.utility';
import { EventData } from '../../utils/event-data';
import { DialogComponent } from '../dialog/dialog.component';

/**
 * Used as a wrapper for the dialog components
 */
@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})

export class EventDialogComponent extends DialogComponent implements OnInit, OnDestroy {

  @Input()
  public eventId: string;
  public active = false;

  private eventBusUtility: EventBusUtils;

  constructor(protected eventBus: EventBusService) {
    super();
    this.eventBusUtility = new EventBusUtils(eventBus);
   }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  public cancelDialog() {
    this.eventBus.emit(new EventData(DialogEvents.Exit, this.eventId));
  }

  private init() {
    this.eventBusUtility.on(`${DialogEvents.Open}/${this.eventId}`, () => {
      this.execute();
    });

    this.eventBusUtility.on(`${DialogEvents.Exit}/${this.eventId}`, () => {
      this.exit();
    });

    this.eventBusUtility.on(`${DialogEvents.Back}/${this.eventId}`, () => {
      this.exit();
    });
  }

  private destroy() {
    this.eventBusUtility.clearSubscriptions();
  }

  private execute() {
    if(this.active) {
      return;
    }

    this.setActiveStatus(true);
  }

  private exit() {
    if(this.active) {
      this.setActiveStatus(false);
    }
  }

  private setActiveStatus(status: boolean) {
    this.active = status;
  }
}
