import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/modules/app/guards/auth-guard.service';
import { ItemsComponent } from './components/items-page/items-page.component';
import { CreateItemDialogComponent } from './components/create-item-dialog/create-item-dialog.component'
import { DetailsItemDialogComponent } from './components/details-item-dialog/details-item-dialog.component'
import { EditItemDialogComponent } from './components/edit-item-dialog/edit-item-dialog.component'
import { DeleteItemDialogComponent } from './components/delete-item-dialog/delete-item-dialog.component'
import { ItemRoutes } from './enums/item-routes';
import { IsCreatingNewItemGuard } from './guards/is-creating-new-item';
import { HasItemSelectedGuard } from './guards/has-item-selected';

const routes: Routes = [{
  path: ItemRoutes.Base,
  component: ItemsComponent,
  canActivate: [AuthGuardService],
  children: [
    { path: ItemRoutes.Create, component: CreateItemDialogComponent, canActivate: [IsCreatingNewItemGuard] },
    { path: ItemRoutes.Details, component: DetailsItemDialogComponent, canActivate: [HasItemSelectedGuard] },
    { path: ItemRoutes.Edit, component: EditItemDialogComponent, canActivate: [HasItemSelectedGuard] },
    { path: ItemRoutes.Delete, component: DeleteItemDialogComponent, canActivate: [HasItemSelectedGuard] }
  ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemRoutingModule { }