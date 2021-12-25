import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInventoryComponent } from './components/list-inventory/list-inventory.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { SharedModule } from '../shared/shared.module';
import { InventoryItemComponent } from './components/inventory-item/inventory-item.component';
import { InventoryService } from './services/inventory.service';
import { AddItemQuantityDialogComponent } from './components/dialogs/add-item/add-item-quantity-dialog/add-item-quantity-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddItemSelectDialogComponent } from './components/dialogs/add-item/add-item-select-dialog/add-item-select-dialog.component';
import { ItemModule } from '../item/item.module';



@NgModule({
  declarations: [
    ListInventoryComponent,
    InventoryComponent,
    InventoryItemComponent,
    AddItemQuantityDialogComponent,
    AddItemSelectDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ItemModule
  ],
  exports: [
    InventoryComponent,
    InventoryRoutingModule
  ],
  providers: [
    InventoryService
  ]
})
export class InventoryModule { }
