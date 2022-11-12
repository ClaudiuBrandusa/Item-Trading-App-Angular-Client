import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventData } from 'src/app/models/utils/event';
import { DialogEvents } from '../../../enums/dialog-events.enum';
import { EventBusService } from '../../../services/event-bus.service';
import { DialogNavigationStackService } from '../../../services/dialog-navigation-stack.service';

@Component({
  selector: 'app-back-next-dialog',
  templateUrl: './back-next-dialog.component.html',
  styleUrls: ['./back-next-dialog.component.css']
})
export class BackNextDialogComponent implements OnInit {

  @Input()
  title = "";

  // when is true, we do not get a next button
  @Input()
  noNext = false;

  // the form used in the component
  // this input is optional 
  @Input()
  form: FormGroup;

  // holds the id of the next page
  @Input()
  nextPageId: string;

  @Input()
  nextButtonCallback: () => void

  // used in order to decide which dialog's component is
  @Input()
  dialogId: string;

  constructor(private navigationStack: DialogNavigationStackService, private eventBus: EventBusService) { }

  ngOnInit(): void {
  }

  next() {
    if (this.nextButtonCallback) {
      this.nextButtonCallback();
    } else if (this.nextPageId) {
      this.emit(DialogEvents.Open, this.nextPageId)
    }
  }

  back() {
    if(this.isRoot())
      return;
    this.emit(DialogEvents.Back, this.dialogId);
  }

  cancel() {
    this.emit(DialogEvents.Exit, this.dialogId);
  }

  isRoot() {
    return this.navigationStack.isRoot();
  }

  private emit(eventId: string, data: any = null) {
    this.eventBus.emit(new EventData(eventId, data));
  }

}
