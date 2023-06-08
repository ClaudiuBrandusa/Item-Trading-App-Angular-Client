import { Component, Input } from '@angular/core';
import { PageEvents } from '../../../enums/page-events.enum';
import { EventBusService } from '../../../services/event-bus.service';
import { NavigationService } from '../../../services/navigation.service';
import { MenuButtonComponent } from '../../menu-bar/menu-button/menu-button.component';

@Component({
  selector: 'navbar-button',
  templateUrl: './navbar-button.component.html',
  styleUrls: ['./navbar-button.component.css', '../../menu-bar/menu-button/menu-button.component.css']
})
export class NavbarButtonComponent extends MenuButtonComponent {

  @Input()
  route: string = null; // the route where the button leads on click

  private get currentRoute () {
    return new URL(window.location.href).pathname.slice(1);
  }

  constructor(protected eventBusService: EventBusService, protected navigationService: NavigationService) {
    super(eventBusService, navigationService);
    this.allowDeselectOnClick = false;
  }

  override ngOnInit(): void {
    if(this.eventId == null) { 
      this.eventId = this.route;
    }

    this.openSubscriptionId = `${PageEvents.Open}/${this.eventId}`;
    this.exitSubscriptionId = `${PageEvents.Exit}/${this.eventId}`;
    this.openEventId = PageEvents.Open;
    this.exitEventId = PageEvents.Exit;

    super.ngOnInit();
  }
  
  protected async navigate() {
    return await this.navigationService.navigate(this.route);
  }

  protected override shouldSelect() {
    return this.currentRoute.split('/').includes(this.route);
  }
}
