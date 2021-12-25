import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventData } from 'src/app/models/utils/event';
import { DialogEventsId } from '../../enums/dialog-events-id.enum';
import { EventBusService } from '../../services/event-bus.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})

export class EventDialogComponent extends DialogComponent implements OnDestroy {

  @Input()
  public eventId: string;
  private initSubscription: Subscription;
  private exitSubscription: Subscription;
  private backSubscription: Subscription;
  public active = false;

  constructor(protected eventBus: EventBusService) {
    super();
   }

  override ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  public cancelDialog() {
    this.eventBus.emit(new EventData(DialogEventsId.Exit, null));
  }

  private init() {
    if(this.initSubscription == null) {
      this.initSubscription = this.eventBus.on(this.eventId, () => {
        this.execute();
      })
    }

    if(this.exitSubscription == null) {
      this.exitSubscription = this.eventBus.on(DialogEventsId.Exit+this.eventId, () => {
        this.exit();
      });
    }

    if(this.backSubscription == null) {
      this.backSubscription = this.eventBus.on(DialogEventsId.Back+this.eventId, () => {
        // the dialog will just close itself
        this.exit();
      });
    }
  }

  private destroy() {
    if(this.initSubscription) {
      this.initSubscription.unsubscribe();
      this.initSubscription = null;
    }

    if(this.exitSubscription) {
      this.exitSubscription.unsubscribe();
      this.exitSubscription = null;
    }

    if(this.backSubscription) {
      this.backSubscription.unsubscribe();
      this.backSubscription = null;
    }
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
