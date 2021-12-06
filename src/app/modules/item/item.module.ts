import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemsComponent } from './components/list-items/list-items.component';
import { SharedModule } from '../shared/shared.module';
import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './components/item/item.component';
import { ItemService } from './services/item.service';
import { CreateItemDialogComponent } from './components/create-item-dialog/create-item-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteItemDialogComponent } from './components/delete-item-dialog/delete-item-dialog.component';
import { EditItemDialogComponent } from './components/edit-item-dialog/edit-item-dialog.component';
import { DetailsItemDialogComponent } from './components/details-item-dialog/details-item-dialog.component';
import { ItemsComponent } from './components/items/items.component';



@NgModule({
  declarations: [
    ListItemsComponent,
    ItemComponent,
    CreateItemDialogComponent,
    DeleteItemDialogComponent,
    EditItemDialogComponent,
    DetailsItemDialogComponent,
    ItemsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    ItemsComponent,
    ItemRoutingModule
  ],
  providers: [ItemService]
})
export class ItemModule { }
