import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvents } from '../../../enums/page-events.enum';
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

  private get currentRoute () {
    return new URL(window.location.href).pathname.slice(1);
  }

  constructor(private router: Router, protected eventBusService: EventBusService) {
    super(eventBusService);
    this.allowDeselectOnClick = false;
  }

  override ngOnInit(): void {
    if(this.eventId == null) { 
      this.eventId = this.route;
    }

    this.openSubscriptionId = `${PageEvents.Open}/${this.eventId}`;
    this.exitSubscriptionId = `${PageEvents.Exit}/${this.eventId}`;
    this.openEventId = PageEvents.Open;

    super.ngOnInit();
  }

  protected override async onSelect(_data: any = null) {
    if (this.currentRoute != this.route) {
      await this.router.navigate([this.route]);
    }
  }

  protected override shouldSelect() {
    return this.currentRoute === this.route;
  }
}
