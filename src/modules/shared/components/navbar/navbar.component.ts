import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { RefreshTokenService } from 'src/modules/identity/services/refresh-token.service';
import { selectNotificationsCount, selectNotificationsMenuVisibility } from '../../store/notification/notification.selector';
import { closeNotificationsMenu, openNotificationsMenu, resetNotifications } from '../../store/notification/notification.actions';
import { disconnectInit } from '../../../identity/store/identity/identity.actions';
import { Observable } from 'rxjs';
import { selectConnected } from '../../../identity/store/identity/identity.selector';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public notificationsMenuOpened = false;
  @ViewChild('notificationsButton', {read: ElementRef})
  notificationsButtonElementReference: ElementRef

  @ViewChild('notifications', {read: ElementRef})
  notificationsElementReference: ElementRef

  notificationsCount;

  isConnected$: Observable<boolean>;
  connected = false;

  constructor(public refreshTokenService: RefreshTokenService, private store: Store) {
    store.select(selectNotificationsCount).subscribe((count) => {
      this.notificationsCount = count;
    });

    store.select(selectNotificationsMenuVisibility).subscribe((isMenuOpened) => {
      this.toggleNotificationsMenu(isMenuOpened);
    });

    store.select(selectConnected).subscribe(connected => {
      this.connected = connected;
    });
  }

  private dispatchNotificationsMenu(state = !this.notificationsMenuOpened) {
    if (state) {
      this.store.dispatch(openNotificationsMenu());
    } else {
      this.store.dispatch(closeNotificationsMenu());
    }
  }

  private toggleNotificationsMenu(state) {
    this.notificationsMenuOpened = state;
  }

  logout() {
    this.store.dispatch(resetNotifications());
    this.store.dispatch(disconnectInit(this.refreshTokenService.getToken()));
  }

  @HostListener('document:click', ['$event'])
  click(event) {
    if (!this.connected) return;

    if (this.notificationsButtonElementReference.nativeElement.contains(event.target)) {
      this.dispatchNotificationsMenu();
      return;
    }

    if (!this.notificationsMenuOpened) return;

    // checking if a navigation button was clicked
    if (event.y < this.notificationsButtonElementReference.nativeElement.clientHeight) {
      return;
    }

    if (!event.composedPath().find(x => x === this.notificationsElementReference.nativeElement)) {
      this.dispatchNotificationsMenu(false);
    }
  }
}
