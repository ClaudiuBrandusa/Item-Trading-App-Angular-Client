import { Component, OnInit } from '@angular/core';
import { Item } from 'src/modules/item/models/responses/item';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { NavigationService } from '../../../shared/services/navigation.service';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'dialog-details-item',
  templateUrl: './details-item-dialog.component.html',
  styleUrls: ['./details-item-dialog.component.css']
})
export class DetailsItemDialogComponent implements OnInit {

  item: Item = null;

  get itemName() {
    return this.item == null ? "" : this.item.name;
  }

  get itemDescription() {
    return this.item == null ? "" : this.item.description;
  }

  constructor(protected eventBus: EventBusService, private service: ItemService, private navigationService: NavigationService) {}

  ngOnInit() {
    const itemId = this.service.getSelectedItemId();

    if (!!!itemId) {
      this.exit();
      return;
    }

    this.service.getItem(itemId).subscribe({
      next: (response) => {
        this.item = response;
      },
      error: (error) => {
        console.log('Error at get item found: ', error);
      }
    })
  }

  exit() {
    this.service.deselect();
    this.navigationService.back();
  }
}
