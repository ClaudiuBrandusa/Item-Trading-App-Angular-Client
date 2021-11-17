import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemsComponent } from './components/list-items/list-items.component';
import { SharedModule } from '../shared/shared.module';
import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './components/item/item.component';
import { ItemService } from './services/item.service';
import { CreateItemDialogComponent } from './components/create-item-dialog/create-item-dialog.component';



@NgModule({
  declarations: [
    ListItemsComponent,
    ItemComponent,
    CreateItemDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ListItemsComponent,
    ItemRoutingModule
  ],
  providers: [ItemService]
})
export class ItemModule { }
