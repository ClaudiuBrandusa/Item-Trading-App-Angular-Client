import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-default-dialog',
  templateUrl: './default-dialog.component.html',
  styleUrls: ['./default-dialog.component.css']
})
export class DefaultDialogComponent {

  @Input()
  title: string;

  @Input()
  cancelButtonName = "Cancel";

  @Input()
  nextButtonName = "Next";

  @Input()
  hideCancelButton: boolean;

  @Input()
  hideNextButton: boolean;

  @Input()
  hideXButton: boolean;
  
  @Input()
  isNextButtonDisabled = false;
  
  @Input()
  isCancelButtonDisabled = false;

  @Output()
  onContinue = new EventEmitter();

  @Output()
  onExit = new EventEmitter();

  constructor() { }

  next() {
    this.onContinue.emit();
  }

  cancel() {
    this.onExit.emit();
  }
}
