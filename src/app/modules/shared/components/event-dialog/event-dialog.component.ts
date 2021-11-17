import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventData } from 'src/app/models/utils/event';
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
    if(this.active) {
      this.setActiveStatus(false);
      this.eventBus.emit(new EventData("exit_dialog", null));
    }
  }

  private init() {
    if(this.initSubscription == null) {
      this.initSubscription = this.eventBus.on(this.eventId, () => {
        this.execute();
      })
    }
  }

  private destroy() {
    if(this.initSubscription) {
      this.initSubscription.unsubscribe();
      this.initSubscription = null;
    }
  }

  private execute() {
    if(this.active) {
      return;
    }

    this.setActiveStatus(true);
  }

  private setActiveStatus(status: boolean) {
    this.active = status;
  }
}
