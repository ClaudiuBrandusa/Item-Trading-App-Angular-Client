import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInventoryComponent } from './components/list-inventory/list-inventory.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { SharedModule } from '../shared/shared.module';
import { InventoryItemComponent } from './components/inventory-item/inventory-item.component';
import { InventoryService } from './services/inventory.service';



@NgModule({
  declarations: [
    ListInventoryComponent,
    InventoryComponent,
    InventoryItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule
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
