import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationService } from '../../shared/services/navigation.service';
import { InventoryRoutes } from '../enums/inventory-routes';
import { InventoryService } from '../services/inventory.service';

@Injectable({
  providedIn: 'root'
})
export class ShouldSelectItemGuard implements CanActivate {
  constructor(private inventoryService: InventoryService, private navigationService: NavigationService) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.inventoryService.selectItemState) {
        return this.navigationService.redirect(InventoryRoutes.Base);
      }
    
      return true;
  }
}
