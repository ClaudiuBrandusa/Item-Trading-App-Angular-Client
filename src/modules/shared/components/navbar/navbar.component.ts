import { Component } from '@angular/core';
import { RefreshTokenService } from 'src/modules/identity/services/refresh-token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public authService: RefreshTokenService) { }

  logout() {
    this.authService.signOut();
  }
}
