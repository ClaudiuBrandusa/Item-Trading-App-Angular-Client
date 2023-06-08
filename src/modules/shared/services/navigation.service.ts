import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EventBusService } from './event-bus.service';
import { EventData } from '../utils/event-data';
import { DialogEvents } from '../enums/dialog-events.enum';
import { Stack } from '../../shared/utils/stack';
import { NavigationHistory } from '../models/navigation/navigation-history';
import { filter } from 'rxjs';
import { NavigationEvents } from '../enums/navigation-events.enum';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private history = new Array<NavigationHistory>();
  private activeModals = new Array<string>();
  private modalStack = new Stack<string>();

  constructor(private router: Router, private eventBus: EventBusService) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      event = event as NavigationEnd;
      this.history.push(new NavigationHistory({ id: event.id, route: event.url }));
    });
  }

  async navigate(pageName: string, relative = false) {
    if (this.activeModals.length > 0) return false;

    if (this.currentRoute === pageName) return false;

    try {
      if (relative) {
        let activatedRoute = this.router.routerState.root.children[0];
        while(activatedRoute.children.length > 0) {
          activatedRoute = activatedRoute.children[0];
        }
        await this.router.navigate([pageName], { relativeTo: activatedRoute });
      }
      else {
        await this.router.navigate([pageName]);
      }
    } catch {
      return false;
    } 

    return true;
  }

  async openPopup(popupName: string) {
    if (this.activeModals.includes(popupName)) return;

    this.modalStack.add(popupName);
    this.activeModals.push(popupName);

    this.eventBus.emit(new EventData(NavigationEvents.OpenAsPopup, popupName));
  }

  async redirect(route: string) {
    return await this.router.navigate([route], { replaceUrl: true });
  }
  
  get completeRoute() {
    return new URL(window.location.href).pathname;
  }

  get currentRoute() {
    const completeRouteAsList = this.completeRoute.split("/");
    return completeRouteAsList[completeRouteAsList.length-1];
  }

  backToRoute(route: string) {
    this.closeLastModalOpened();
    const navigationHistoryIndex = this.history.findIndex(x => x.route === route || x.route === `/${route}` || x.route.includes(`/${route}`));
    const navigationHistoryToBeRemoved = this.history.slice(navigationHistoryIndex + 1);
    this.history.splice(navigationHistoryIndex);
    navigationHistoryToBeRemoved.forEach(navigationHistory => {
      const routeSplitted = navigationHistory.route.split("/");
      this.emitExitEventForDialog(routeSplitted[routeSplitted.length - 1]);
    });
    this.router.navigateByUrl(route);
  }

  back() {
    if (this.history.length < 2) return;

    this.backToRoute(this.history[this.history.length - 2].route);
  }

  closePopup() {
    this.closeLastModalOpened();
  }

  private closeLastModalOpened() {
    const modal = this.modalStack.pop();
    if (!modal || !this.activeModals.includes(modal)) return;
    this.eventBus.emit(new EventData(NavigationEvents.ClosePopup, modal));
  }

  private emitExitEventForDialog(dialog: string, data = null) {
    this.eventBus.emit(new EventData(`${DialogEvents.Exit}/${dialog}`, data));
  }
}
