import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemsComponent } from './components/list-items/list-items.component';
import { SharedModule } from '../shared/shared.module';
import { ItemRoutingModule } from './item-routing.module';



@NgModule({
  declarations: [
    ListItemsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ListItemsComponent,
    ItemRoutingModule
  ]
})
export class ItemModule { }
