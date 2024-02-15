import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/modules/app/guards/auth-guard.service';
import { InventoryPageComponent } from './components/inventory-page/inventory-page.component';
import { InventoryRoutes } from './enums/inventory-routes';
import { AddItemSelectDialogComponent } from './components/add-item-select-dialog/add-item-select-dialog.component'
import { AddItemQuantityDialogComponent } from './components/add-item-quantity-dialog/add-item-quantity-dialog.component';
import { DropItemQuantityDialogComponent } from './components/drop-item-dialog-quantity/drop-item-quantity-dialog.component';
import { hasItemSelectedGuard } from './guards/has-item-selected.guard';
import { shouldSelectItemGuard } from './guards/should-select-item.guard';

const routes: Routes = [{
    path: InventoryRoutes.Base,
    component: InventoryPageComponent,
    canActivate: [authGuard],
    children: [
      { path: InventoryRoutes.Select, component: AddItemSelectDialogComponent, canActivate: [shouldSelectItemGuard] },
      { path: InventoryRoutes.Quantity, component: AddItemQuantityDialogComponent, canActivate: [hasItemSelectedGuard] },
      { path: InventoryRoutes.Drop, component: DropItemQuantityDialogComponent, canActivate: [hasItemSelectedGuard] }
    ]
  }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InventoryRoutingModule {}