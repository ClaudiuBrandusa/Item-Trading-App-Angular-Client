import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  private _disabled: boolean;

  @Input() set disabled(value: boolean) {
    this._disabled = value;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  private _type: string = "button"

  @Input() set type(value: string) {
    this._type = value;
  }

  get type(): string {
    return this._type
  }

  @Input()
  background_color_class = "";

  @Input()
  rounded = false;

  constructor() { }
}
