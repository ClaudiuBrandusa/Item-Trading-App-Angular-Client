import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { EventBusService } from './event-bus.service';
import { EventData } from '../utils/event-data';
import { DialogEvents } from '../enums/dialog-events.enum';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private isDialogOpen: boolean;

  constructor(private router: Router, private location: Location, private eventBus: EventBusService) {
    this.isDialogOpen = this.completeRoute.split("/").length > 2
  }

  async navigate(pageName: string, relative = false, isDialog = false) {
    if (this.currentRoute === pageName) return false;

    if (isDialog) {
      if (this.isDialogOpen) return false;
      this.isDialogOpen = true;
    }

    try {
      if (relative)
        await this.router.navigate([`${this.router.url}/${pageName}`]);
      else
        await this.router.navigate([pageName]);
    } catch {
      return false;
    } 

    return true;
  }
  
  get completeRoute() {
    return new URL(window.location.href).pathname;
  }

  get currentRoute() {
    const completeRouteAsList = this.completeRoute.split("/");
    return completeRouteAsList[completeRouteAsList.length-1];
  }

  back() {
    const oldRoute = this.currentRoute;
    if (this.isDialogOpen) this.isDialogOpen = false;
    this.location.back();
    this.eventBus.emit(new EventData(`${DialogEvents.Exit}/${oldRoute}`, null));
  }
}
