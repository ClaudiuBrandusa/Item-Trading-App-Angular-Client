import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EventBusService } from './event-bus.service';
import { EventData } from '../utils/event-data';
import { DialogEvents } from '../../dialog/enums/dialog-events.enum';
import { Stack } from '../../shared/utils/stack';
import { NavigationHistory } from '../models/navigation/navigation-history';
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { openPopupInitiated, closePopupInitiated } from '../../../standalone/modal-manager/store/modal.actions';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private history = new Array<NavigationHistory>();
  private activeModals = new Array<string>();
  private modalStack = new Stack<string>();

  constructor(private router: Router, private eventBus: EventBusService, private store: Store) {
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
    } catch(_exception) {
      return false;
    } 

    return true;
  }

  async openPopup(popupName: string) {
    if (this.activeModals.includes(popupName)) return;

    this.modalStack.add(popupName);
    this.activeModals.push(popupName);

    this.store.dispatch(openPopupInitiated(popupName));
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
    if (this.history.length < 2) {
      const routerConfigs = this.getRouterConfigsFromPath(this.router.url);
      if (!routerConfigs || routerConfigs.length < 2) return;
      this.emitExitEventForDialog(routerConfigs[routerConfigs.length - 1].path);
      if (this.history.length === 1) this.history.splice(this.history.length - 1, 1);
      this.redirect(routerConfigs[routerConfigs.length - 2].path);
      return;
    }

    const oldRoute = this.history[this.history.length - 1].route;
    this.history.splice(this.history.length - 1, 1);
    const oldRouteAsArray = oldRoute.split('/').filter(x => x);
    this.emitExitEventForDialog(oldRouteAsArray[oldRouteAsArray.length - 1]);
    this.backToRoute(this.history[this.history.length - 1].route);
  }

  closePopup() {
    this.closeLastModalOpened();
  }

  private getRouterConfigsFromPath(path: string) {
    const currentRouteSplitAsArray = path.split('/').filter(x => x);
    let currentConfigArray = this.router.config;
    const routeConfigList = [];
    currentRouteSplitAsArray.forEach(route => {
        if (currentConfigArray.length === 0) return;
        const tmp = currentConfigArray.find(config => config.path === route);
        if (!tmp) return;
        routeConfigList.push(tmp) 
        if (!tmp.children) return;
        currentConfigArray = tmp.children;
    });
    return routeConfigList 
  }

  private closeLastModalOpened() {
    const modal = this.modalStack.pop();
    if (!modal || !this.activeModals.includes(modal)) return;
    this.activeModals.splice(this.activeModals.indexOf(modal), 1);
    this.store.dispatch(closePopupInitiated(modal));
  }

  private emitExitEventForDialog(dialog: string, data = null) {
    this.eventBus.emit(new EventData(`${DialogEvents.Exit}/${dialog}`, data));
  }
}
