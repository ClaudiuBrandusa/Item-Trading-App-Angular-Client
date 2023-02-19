import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Item } from 'src/modules/item/models/responses/item';
import { ListItemDirective } from 'src/modules/shared/directives/list/list-item/list-item.directive';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { NavigationService } from '../../../shared/services/navigation.service';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { ItemEvents } from '../../enums/item-events';
import { ItemRoutes } from '../../enums/item-routes';
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

  @Input()
  onItemLoadedFunction: (item: Item) => void;

  @Input()
  small = false;

  @Input()
  hideUntilLoaded = false;

  loaded = true;

  private eventBusUtility: EventBusUtils;

  constructor(private service: ItemService, eventBus: EventBusService, private navigationService: NavigationService) {
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
    if (this.hideUntilLoaded) this.loaded = false;
    this.getItem();
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  getItem() {
    this.service.getItem(this.itemId).subscribe({
      next: (response: Item) => {
        this.item = response
        if (this.onItemLoadedFunction) this.onItemLoadedFunction(response);
      },
      error: (error) => {
        console.log(`Error at loading item data for id ${this.itemId}: `, error)
      },
      complete: () => {
        if(this.hideUntilLoaded) this.loaded = true;
      }
    })
  }

  edit() {
    this.select(ItemRoutes.Edit);
  }

  delete() {
    this.select(ItemRoutes.Delete);
  }

  details() {
    this.select(ItemRoutes.Details);
  }

  // Utils

  private async select(route: string) {
    this.service.select(this.item.id);
    if (!await this.navigationService.navigate(route, true, true)) this.service.deselect();
  }
}
