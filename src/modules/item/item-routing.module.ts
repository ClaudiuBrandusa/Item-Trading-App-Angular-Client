import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/modules/app/guards/auth-guard.service';
import { ItemsComponent } from './components/items-page/items-page.component';
import { CreateItemDialogComponent } from './components/create-item-dialog/create-item-dialog.component'
import { DetailsItemDialogComponent } from './components/details-item-dialog/details-item-dialog.component'
import { EditItemDialogComponent } from './components/edit-item-dialog/edit-item-dialog.component'
import { DeleteItemDialogComponent } from './components/delete-item-dialog/delete-item-dialog.component'
import { ItemRoutes } from './enums/item-routes';
import { isCreatingNewItemGuard } from './guards/is-creating-new-item';
import { hasItemSelectedGuard } from './guards/has-item-selected';

const routes: Routes = [{
  path: ItemRoutes.Base,
  component: ItemsComponent,
  canActivate: [authGuard],
  children: [
    { path: ItemRoutes.Create, component: CreateItemDialogComponent, canActivate: [isCreatingNewItemGuard] },
    { path: ItemRoutes.Details, component: DetailsItemDialogComponent, canActivate: [hasItemSelectedGuard] },
    { path: ItemRoutes.Edit, component: EditItemDialogComponent, canActivate: [hasItemSelectedGuard] },
    { path: ItemRoutes.Delete, component: DeleteItemDialogComponent, canActivate: [hasItemSelectedGuard] }
  ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemRoutingModule { }