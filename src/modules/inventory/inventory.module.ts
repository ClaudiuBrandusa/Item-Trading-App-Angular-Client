import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInventoryComponent } from './components/list-inventory/list-inventory.component';
import { InventoryPageComponent } from './components/inventory-page/inventory-page.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { SharedModule } from '../shared/shared.module';
import { InventoryItemComponent } from './components/inventory-item/inventory-item.component';
import { InventoryService } from './services/inventory.service';
import { AddItemQuantityDialogComponent } from './components/add-item-quantity-dialog/add-item-quantity-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddItemSelectDialogComponent } from './components/add-item-select-dialog/add-item-select-dialog.component';
import { ItemModule } from '../item/item.module';
import { DropItemQuantityDialogComponent } from './components/drop-item-dialog-quantity/drop-item-quantity-dialog.component';



@NgModule({
  declarations: [
    ListInventoryComponent,
    InventoryPageComponent,
    InventoryItemComponent,
    AddItemQuantityDialogComponent,
    AddItemSelectDialogComponent,
    DropItemQuantityDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ItemModule
  ],
  exports: [
    InventoryPageComponent,
    InventoryRoutingModule
  ],
  providers: [
    InventoryService
  ]
})
export class InventoryModule { }
