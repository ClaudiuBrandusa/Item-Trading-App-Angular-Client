import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InventoryItem } from 'src/app/models/response/inventory/inventory-item';
import { EventData } from 'src/app/models/utils/event';
import { EventSubscription } from 'src/app/models/utils/event-subscription';
import { ListItemDirective } from 'src/app/modules/shared/directives/list/list-item/list-item.directive';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { DialogEvents } from '../../../shared/enums/dialog-events.enum';
import { InventoryDialogEvents } from '../../enums/InventoryDialogEvents';
import { InventoryEvents } from '../../enums/InventoryEvents';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.css']
})
export class InventoryItemComponent extends ListItemDirective implements OnInit, OnDestroy {
 
  @Input()
  hasControls = true;

  @Input()
  isShort = false;

  @Input()
  item = new InventoryItem();

  itemRefreshSubscription: EventSubscription;
  
  constructor(private service: InventoryService, private eventBus: EventBusService) {
    super();
  }

  ngOnInit(): void {
    this.itemRefreshSubscription.init();
  }

  ngOnDestroy(): void {
    this.itemRefreshSubscription.clear();
  }

  protected override onSetItemId() {
    this.initSubscriptionsFactory();
  }

  protected override loadData() {
    this.getItem();
  }

  async getItem() {
    const response = await this.service.getItem(this.itemId);

    if (response.hasOwnProperty('errorCode')) {
      if (response.errorCode === 400)
        this.eventBus.emit(new EventData(InventoryEvents.Remove, this.itemId));
    } else {
      this.item = response;
    }
  }

  add() {
    this.selectItemOption(InventoryDialogEvents.AddQuantity);
  }

  drop() {
    this.selectItemOption(InventoryDialogEvents.Drop);
  }

  details() {
    this.selectItemOption(InventoryDialogEvents.Details);
  }

  // Subscriptions methods

  private initSubscriptionsFactory() {
    this.itemRefreshSubscription = new EventSubscription(this.eventBus, InventoryEvents.RefreshItem+this.itemId, () => {
      this.getItem();
    });
  }

  // Utils

  private selectItemOption(eventId: string) {
    this.service.select(this.item.id);
    this.eventBus.emit(new EventData(DialogEvents.Open, eventId));
  }
}
