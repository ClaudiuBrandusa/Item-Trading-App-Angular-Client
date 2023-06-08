import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/modules/app/guards/auth-guard.service';
import { InventoryPageComponent } from './components/inventory-page/inventory-page.component';
import { InventoryRoutes } from './enums/inventory-routes';
import { AddItemSelectDialogComponent } from './components/add-item-select-dialog/add-item-select-dialog.component'
import { AddItemQuantityDialogComponent } from './components/add-item-quantity-dialog/add-item-quantity-dialog.component';
import { DropItemQuantityDialogComponent } from './components/drop-item-dialog-quantity/drop-item-quantity-dialog.component';
import { HasItemSelectedGuard } from './guards/has-item-selected.guard';
import { ShouldSelectItemGuard } from './guards/should-select-item.guard';

const routes: Routes = [{
    path: InventoryRoutes.Base,
    component: InventoryPageComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: InventoryRoutes.Select, component: AddItemSelectDialogComponent, canActivate: [ShouldSelectItemGuard] },
      { path: InventoryRoutes.Quantity, component: AddItemQuantityDialogComponent, canActivate: [HasItemSelectedGuard] },
      { path: InventoryRoutes.Drop, component: DropItemQuantityDialogComponent, canActivate: [HasItemSelectedGuard] }
    ]
  }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InventoryRoutingModule {}