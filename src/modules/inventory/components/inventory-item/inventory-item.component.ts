import { Component, Input, OnDestroy } from '@angular/core';
import { InventoryItem } from 'src/modules/inventory/models/responses/inventory-item';
import { ListItemDirective } from 'src/modules/shared/directives/list/list-item/list-item.directive';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { ItemError } from '../../../shared/models/errors/item-error';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { EventData } from '../../../shared/utils/event-data';
import { InventoryEvents } from '../../enums/InventoryEvents';
import { InventoryService } from '../../services/inventory.service';
import { InventoryRoutes } from '../../enums/inventory-routes';
import { NavigationService } from '../../../shared/services/navigation.service';

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
  
  constructor(private service: InventoryService, private eventBus: EventBusService, private navigationService: NavigationService) {
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

  getItem() {
    this.service.getItem(this.itemId).subscribe({
      next: (response) => {
        this.item = response as InventoryItem;
      },
      error: (error: ItemError) => {
        if (error.errorCode == 400)
          this.eventBus.emit(new EventData(InventoryEvents.Remove, this.itemId));
      }
    });
  }

  add() {
    this.selectItemOption(InventoryRoutes.Quantity);
  }

  drop() {
    this.selectItemOption(InventoryRoutes.Drop);
  }

  // Utils

  private async selectItemOption(route: string) {
    this.service.select(this.item.itemId);
    if (!await this.navigationService.navigate(route, true)) this.service.deselect();
  }
}
