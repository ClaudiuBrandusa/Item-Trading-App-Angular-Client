import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationService } from '../../shared/services/navigation.service';
import { InventoryRoutes } from '../enums/inventory-routes';
import { InventoryService } from '../services/inventory.service';

@Injectable({
  providedIn: 'root'
})
export class HasItemSelectedGuard implements CanActivate {
  constructor(private inventoryService: InventoryService, private navigationService: NavigationService) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.inventoryService.hasItemSelected()) {
      return this.navigationService.redirect(InventoryRoutes.Base);
    }

    return true;
  }
  
}
