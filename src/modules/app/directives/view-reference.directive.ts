import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[viewRef]'
})
export class ViewReferenceDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}