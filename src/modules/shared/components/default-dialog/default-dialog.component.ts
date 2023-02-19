import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-default-dialog',
  templateUrl: './default-dialog.component.html',
  styleUrls: ['./default-dialog.component.css']
})
export class DefaultDialogComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  cancelButtonName = "Cancel";

  @Input()
  nextButtonName = "Next";

  @Input()
  hideNextButton: boolean;
  
  @Input()
  isNextButtonDisabled = false;
  
  @Input()
  isCancelButtonDisabled = false;

  @Output()
  onContinue = new EventEmitter();

  @Output()
  onExit = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  next() {
    this.onContinue.emit();
  }

  cancel() {
    this.onExit.emit();
  }
}
