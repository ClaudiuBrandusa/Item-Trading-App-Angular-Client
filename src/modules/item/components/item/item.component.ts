import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Item } from 'src/modules/item/models/responses/item';
import { ListItemDirective } from 'src/modules/shared/directives/list/list-item/list-item.directive';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { DialogEvents } from '../../../shared/enums/dialog-events.enum';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { EventData } from '../../../shared/utils/event-data';
import { ItemDialogEvents } from '../../enums/item-dialog-events';
import { ItemEvents } from '../../enums/item-events';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent extends ListItemDirective implements OnInit, OnDestroy {

  @Input()
  hasControls = true;

  @Input()
  isShort = false;
  
  @Input()
  item = new Item();

  private eventBusUtility: EventBusUtils;

  constructor(private service: ItemService, private eventBus: EventBusService) {
    super();
    this.eventBusUtility = new EventBusUtils(eventBus);
  }

  protected override onSetItemId() {
    this.eventBusUtility.on(ItemEvents.UpdateItem+this.itemId, () => {
      this.getItem();
    })
  }

  protected override loadData() {
    this.getItem();
  }

  ngOnInit(): void {
    this.getItem();
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  async getItem() {
    (await this.service.getItem(this.itemId)).subscribe({
      next: (response: Item) => {
        this.item = response
      },
      error: (error) => {
        console.log(`Error at loading item data for id ${this.itemId}: `, error)
      }
    })
  }

  edit() {
    this.select(ItemDialogEvents.EditItem);
  }

  delete() {
    this.select(ItemDialogEvents.DeleteItem);
  }

  details() {
    this.select(ItemDialogEvents.DetailsItem);
  }

  // Utils

  private select(eventId: string) {
    this.service.select(this.item.id);
    this.eventBus.emit(new EventData(DialogEvents.Open, eventId));
  }

}
