import { Component, Input, OnDestroy } from '@angular/core';
import { InventoryItem } from 'src/modules/inventory/models/responses/inventory-item';
import { ListItemDirective } from 'src/modules/shared/directives/list/list-item/list-item.directive';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { ItemError } from '../../../shared/models/errors/item-error';
import { DialogEvents } from '../../../shared/enums/dialog-events.enum';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { EventData } from '../../../shared/utils/event-data';
import { InventoryDialogEvents } from '../../enums/InventoryDialogEvents';
import { InventoryEvents } from '../../enums/InventoryEvents';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.css']
})
export class InventoryItemComponent extends ListItemDirective implements OnDestroy {
 
  @Input()
  hasControls = true;

  @Input()
  isShort = false;

  @Input()
  item = new InventoryItem();

  private eventBusUtility: EventBusUtils;
  
  constructor(private service: InventoryService, private eventBus: EventBusService) {
    super();
    this.eventBusUtility = new EventBusUtils(eventBus);
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  protected override onSetItemId() {
    this.eventBusUtility.on(InventoryEvents.RefreshItem+this.itemId, () => {
      this.getItem();
    });
  }

  protected override loadData() {
    this.getItem();
  }

  async getItem() {
    (await this.service.getItem(this.itemId)).subscribe({
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

  // Utils

  private selectItemOption(eventId: string) {
    this.service.select(this.item.id);
    this.eventBusUtility.emit(DialogEvents.Open, eventId);
  }
}
