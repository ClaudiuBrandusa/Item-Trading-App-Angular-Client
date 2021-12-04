import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/models/response/item/item';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input()
  itemId = "";

  @Input()
  item = new Item();

  constructor(private service: ItemService, private eventBus: EventBusService) { }

  ngOnInit(): void {
    this.getItem();
  }

  async getItem() {
    this.item = await this.service.getItem(this.itemId);
  }

  delete() {
    this.service.select(this.item.id);
    this.eventBus.emit(new EventData(ItemDialogEvents.DeleteItem, this.item.id));
  }

}
