import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from '../../../services/event-bus.service';
import { MenuButtonComponent } from '../../menu-bar/menu-button/menu-button.component';

@Component({
  selector: 'navbar-button',
  templateUrl: './navbar-button.component.html',
  styleUrls: ['./navbar-button.component.css', '../../menu-bar/menu-button/menu-button.component.css']
})
export class NavbarButtonComponent extends MenuButtonComponent {

  @Input()
  route: string = null; // the route where the button leads on click

  private onNavbarSelectionSubscription: Subscription;

  constructor(private router: Router, protected eventBusService: EventBusService) {
    super(eventBusService);
   }

   override ngOnInit(): void {
    super.ngOnInit();

    if(this.eventId == null) {
      this.eventId = this.route;
    }
   }

  protected override async onSelect() {
    if(this.hasRoute())
      await this.router.navigate([this.route]);

    this.announceNavbarSelection();
  }

  protected override isSelected(): boolean {
    return this.router.url.slice(1) === this.route;
  }

  private hasRoute() {
    return this.route != null;
  }

  protected override initEvents() {
    super.initEvents();
    this.initOnNavbarSelection();
  }

  protected override clearEvents() {
    super.clearEvents();
    this.clearOnNavbarSelection();
  }

  private initOnNavbarSelection() {
    if(!this.onNavbarSelectionSubscription)
      this.onNavbarSelectionSubscription = this.eventBusService.on("navbar_selection", () => {
        this.deselect();
      });
  }

  private clearOnNavbarSelection() {
    if(this.onNavbarSelectionSubscription) {
      this.onNavbarSelectionSubscription.unsubscribe();
      this.onNavbarSelectionSubscription = null;
    }
  }

  private announceNavbarSelection() {
    this.eventBusService.emit(new EventData("navbar_selection", null));
  }
}
