import { Component, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from '../../../services/event-bus.service';
import { MenuButtonComponent } from '../../menu-bar/menu-button/menu-button.component';

@Component({
  selector: 'navbar-button',
  templateUrl: './navbar-button.component.html',
  styleUrls: ['./navbar-button.component.css']
})
export class NavbarButtonComponent extends MenuButtonComponent {

  @Input()
  route: string = null; // the route where the button leads on click

  constructor(private router: Router, protected eventBusService: EventBusService) {
    super(eventBusService);
   }

  protected override async onSelect() {
    if(this.hasRoute())
      await this.router.navigate([this.route]);
    this.announceSelection();
  }

  protected override isSelected(): boolean {
    return this.router.url.slice(1) === this.route;
  }

  protected override getAnnounceSelectionEventId() {
    return "select_navbar_button";
  }

  private hasRoute() {
    return this.route != null;
  }
}
