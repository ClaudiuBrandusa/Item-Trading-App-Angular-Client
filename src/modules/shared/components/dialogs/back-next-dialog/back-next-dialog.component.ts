import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogEvents } from '../../../enums/dialog-events.enum';
import { EventBusService } from '../../../services/event-bus.service';
import { DialogNavigationStackService } from '../../../services/dialog-navigation-stack.service';
import { EventData } from '../../../utils/event-data';

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

  @Input()
  isPopup = false;

  // the form used in the component
  // this input is optional 
  @Input()
  form: FormGroup;

  // holds the id of the next page
  @Input()
  nextPageId: string;

  @Input()
  nextButtonCallback: () => void

  @Input()
  nextButtonCustomName: string = '';

  @Input()
  cancelButtonCallback: () => void

  @Input()
  cancelButtonCustomName: string = '';

  // used in order to decide which dialog's component is
  @Input()
  dialogId: string;

  @Input()
  isNextButtonDisabled?: boolean;

  defaultCancelButtonName: string;

  constructor(private navigationStack: DialogNavigationStackService, private eventBus: EventBusService) { }

  private cancelEvent: string;

  ngOnInit(): void {
    this.defaultCancelButtonName = this.isRoot() ? "Cancel" : "Back";

    if (this.isPopup) {
      this.cancelEvent = DialogEvents.ClosePopup;
    } else {
      this.cancelEvent = this.isRoot() ? DialogEvents.Exit : DialogEvents.Back;
    }
  }

  next() {
    if (this.nextButtonCallback) {
      this.nextButtonCallback();
    } else if (this.nextPageId) {
      this.emit(DialogEvents.Open, this.nextPageId)
    }
  }

  cancel() {
    this.handleCustomCancelButton();
    this.emit(this.cancelEvent, this.dialogId);
  }

  private handleCustomCancelButton() {
    if (this.cancelButtonCallback) {
      this.cancelButtonCallback();
    }
  }

  isRoot() {
    return this.navigationStack.isRoot();
  }

  private emit(eventId: string, data: any = null) {
    this.eventBus.emit(new EventData(eventId, data));
  }

}
