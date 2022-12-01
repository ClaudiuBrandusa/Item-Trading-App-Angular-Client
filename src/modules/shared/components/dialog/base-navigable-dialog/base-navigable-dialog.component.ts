import { Component } from '@angular/core';
import { EventBusService } from '../../../services/event-bus.service';
import { BaseDialogComponent } from '../base-dialog/base-dialog.component';
import { DialogEvents } from '../../../enums/dialog-events.enum';

@Component({
  selector: 'app-base-navigable-dialog',
  templateUrl: './base-navigable-dialog.component.html',
  styleUrls: ['./base-navigable-dialog.component.css']
})
export class BaseNavigableDialogComponent extends BaseDialogComponent {

  constructor(protected eventBus: EventBusService) {
    super(eventBus);
  }

  protected navigate(pageId: string) {
    this.emitNavigation(pageId);
  }

  override exitDialog() {
    this.emit(DialogEvents.Exit, this.eventId);
    super.exitDialog();
  }

  private emitNavigation(pageId: string) {
    this.emit(DialogEvents.Open, pageId);
  }

}
