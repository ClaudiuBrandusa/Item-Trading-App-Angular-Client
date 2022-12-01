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

  constructor(private router: Router, protected eventBusService: EventBusService) {
    super(eventBusService);
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
    if(this.hasRoute())
      await this.router.navigate([this.route]);
  }

  protected override isSelected(): boolean {
    return this.router.url.slice(1) === this.route;
  }

  private hasRoute() {
    return this.route != null;
  }
}
