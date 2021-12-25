import { Component } from '@angular/core';
import { EventBusService } from '../../../services/event-bus.service';
import { NavigationStackService } from '../../../services/navigation-stack.service';
import { BaseDialogComponent } from '../base-dialog/base-dialog.component';

@Component({
  selector: 'app-base-navigable-dialog',
  templateUrl: './base-navigable-dialog.component.html',
  styleUrls: ['./base-navigable-dialog.component.css']
})
export class BaseNavigableDialogComponent extends BaseDialogComponent {

  constructor(protected eventBus: EventBusService, protected navigationStack: NavigationStackService) {
    super(eventBus);
  }

  protected navigate(pageId: string) {
    this.emitNavigation(pageId);
    this.exitDialog();
  }

  back() {
    if(this.hasBackButton()) {
      this.emitNavigation(this.navigationStack.back(), null);
      this.exitDialog();
    }
  }

  hasBackButton() {
    return !this.navigationStack.isRoot();
  }

  protected cancelDialog() {
    this.navigationStack.clear();
    this.exitDialog();
  }

  private emitNavigation(pageId: string, withoutStackPush: boolean = false) {
    if(!withoutStackPush)
      this.navigationStack.navigate(this.eventId);
    // emits the instantiation event of the requested page's id 
    this.emit(pageId, null);
  }

}
