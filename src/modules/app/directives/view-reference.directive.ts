import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[viewRef]',
    standalone: false
})
export class ViewReferenceDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}