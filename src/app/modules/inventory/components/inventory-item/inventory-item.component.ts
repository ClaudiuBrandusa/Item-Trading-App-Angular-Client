import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryItem } from 'src/app/models/response/inventory/inventory-item';
import { EventData } from 'src/app/models/utils/event';
import { EventSubscription } from 'src/app/models/utils/event-subscription';
import { ListItemDirective } from 'src/app/modules/shared/directives/list/list-item/list-item.directive';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemError } from '../../../../models/errors/item-error';
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

  private getDataSubscription: Subscription;

  itemRefreshSubscription: EventSubscription;
  
  constructor(private service: InventoryService, private eventBus: EventBusService) {
    super();
  }

  ngOnInit(): void {
    this.itemRefreshSubscription.init();
  }

  ngOnDestroy(): void {
    this.itemRefreshSubscription.clear();
    this.getDataSubscription?.unsubscribe();
  }

  protected override onSetItemId() {
    this.initSubscriptionsFactory();
  }

  protected override loadData() {
    this.getItem();
  }

  async getItem() {
    this.getDataSubscription = (await this.service.getItem(this.itemId)).subscribe({
      next: (response: any) => {
        this.item.id = response.itemId;
        this.item.name = response.itemName;
        this.item.quantity = response.quantity;
      },
      error: (error: ItemError) => {
        if (error.errorCode == 400)
          this.eventBus.emit(new EventData(InventoryEvents.Remove, this.itemId));
      }
    });
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
