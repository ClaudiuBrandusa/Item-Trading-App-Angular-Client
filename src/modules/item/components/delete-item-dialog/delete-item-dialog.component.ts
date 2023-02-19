import { Component, OnInit } from '@angular/core';
import { Item } from 'src/modules/item/models/responses/item';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { EventData } from '../../../shared/utils/event-data';
import { ItemEvents } from '../../enums/item-events';
import { ItemService } from '../../services/item.service';
import { NavigationService } from '../../../shared/services/navigation.service';

@Component({
  selector: 'dialog-delete-item',
  templateUrl: './delete-item-dialog.component.html',
  styleUrls: ['./delete-item-dialog.component.css']
})
export class DeleteItemDialogComponent implements OnInit {
  
  item: Item = null;

  get itemName() {
    return this.item == null ? "" : this.item.name;
  }

  constructor(private service: ItemService, protected eventBus: EventBusService, private navigationService: NavigationService) {}
  
  ngOnInit(): void {
    this.service.getItem(this.service.getSelectedItemId()).subscribe({
      next: (response) => {
        this.item = response;
      },
      error: (error) => {
        console.log('Error at get item found: ', error);
      }
    })
  }

  // response functions

  delete() {
    if(this.item == null) return;
    this.service.deleteItem(this.item.id).subscribe({
      next: (_response) => {
        this.eventBus.emit(new EventData(ItemEvents.DeleteItem, this.item.id));
        this.exit();
      },
      error: (error) => {
        console.log('Error at delete item found: ', error);
      }
    });
  }

  exit() {
    this.service.deselect();
    this.navigationService.back();
  }
}
