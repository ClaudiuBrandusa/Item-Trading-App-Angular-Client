import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventData } from 'src/app/models/utils/event';
import { DialogEventsId } from '../../../enums/dialog-events-id.enum';
import { EventBusService } from '../../../services/event-bus.service';
import { NavigationStackService } from '../../../services/navigation-stack.service';

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

  // used in order to decide which dialog's component is
  @Input()
  dialogId: string;

  constructor(private navigationStack: NavigationStackService, private eventBus: EventBusService) { }

  ngOnInit(): void {
  }

  next() {
    console.log("next");
    this.navigationStack.navigate(this.nextPageId);
  }

  back() {
    console.log("back");
    if(this.isRoot())
      return;
    this.emit(DialogEventsId.Back+this.dialogId);
  }
  cancel() {
    console.log("cancel");
    if(this.isRoot()) {
      this.navigationStack.clear();
      this.emit(DialogEventsId.Exit+this.dialogId);
    }
  }

  isRoot() {
    return this.navigationStack.isRoot();
  }

  private emit(eventId: string) {
    this.eventBus.emit(new EventData(eventId, null));
  }

}
