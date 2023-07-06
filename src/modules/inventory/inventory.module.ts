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
import { StoreModule } from '@ngrx/store';
import { InventoryItemReducer } from './store/inventory/inventory.reducer';
import { ItemReducer } from '../item/store/item.reducer';
import * as inventoryEffects from './store/inventory/inventory.effects'
import * as itemEffects from '../item/store/item.effects';
import { provideEffects } from '@ngrx/effects';
import { InventoryItem } from './models/responses/inventory-item';



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
    ItemModule,
    StoreModule.forFeature("inventory", InventoryItemReducer),
    StoreModule.forFeature("item", ItemReducer)
  ],
  exports: [
    InventoryPageComponent,
    InventoryRoutingModule,
    InventoryItemComponent
  ],
  providers: [
    InventoryService,
    provideEffects(inventoryEffects),
    provideEffects(itemEffects)
  ]
})
export class InventoryModule { }
