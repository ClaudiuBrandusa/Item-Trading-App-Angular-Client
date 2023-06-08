import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/modules/app/guards/auth-guard.service';
import { ItemsComponent } from './components/items-page/items-page.component';
import { CreateItemDialogComponent } from './components/create-item-dialog/create-item-dialog.component'
import { DetailsItemDialogComponent } from './components/details-item-dialog/details-item-dialog.component'
import { EditItemDialogComponent } from './components/edit-item-dialog/edit-item-dialog.component'
import { DeleteItemDialogComponent } from './components/delete-item-dialog/delete-item-dialog.component'
import { ItemRoutes } from './enums/item-routes';

const routes: Routes = [{
  path: ItemRoutes.Base,
  component: ItemsComponent,
  canActivate: [AuthGuardService],
  children: [
    { path: ItemRoutes.Create, component: CreateItemDialogComponent },
    { path: ItemRoutes.Details, component: DetailsItemDialogComponent },
    { path: ItemRoutes.Edit, component: EditItemDialogComponent },
    { path: ItemRoutes.Delete, component: DeleteItemDialogComponent }
  ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemRoutingModule { }