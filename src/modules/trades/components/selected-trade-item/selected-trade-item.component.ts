import { Component, Input, OnDestroy } from '@angular/core';
import { ListItemDirective } from 'src/modules/shared/directives/list/list-item/list-item.directive';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { TradePopupsNames } from '../../enums/trade-popups-names';
import { TradeItemEvents } from '../../enums/trade-item-events';
import { TradeItem } from '../../models/trade-item';
import { TradesService } from '../../services/trades.service';
import { NavigationService } from '../../../shared/services/navigation.service';

@Component({
  selector: 'app-selected-trade-item',
  templateUrl: './selected-trade-item.component.html',
  styleUrls: ['./selected-trade-item.component.css']
})
export class SelectedTradeItemComponent extends ListItemDirective implements OnDestroy {

  @Input()
  getTradeItemFunction: (itemId: string) => TradeItem | null;

  @Input()
  editable: boolean;

  item = new TradeItem();

  private eventBusUtility: EventBusUtils;
  
  constructor(eventBus: EventBusService, private service: TradesService, private navigationService: NavigationService) {
    super();
    this.eventBusUtility = new EventBusUtils(eventBus);
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  protected override onSetItemId() {
    this.eventBusUtility.on(TradeItemEvents.Update+this.itemId, (tradeItem: TradeItem) => {
      this.item = tradeItem;
    })
  }

  protected override loadData() {
    this.getItem();
  }

  getItem() {
    const item = this.getTradeItemFunction(this.itemId);
    if (item == null) return;
    this.item = item;
  }

  edit() {
    if (this.editable) {
      this.service.setCurrentTradeItem(this.item);
      this.navigationService.openPopup(TradePopupsNames.SetItemQuantityAndPrice);
    }
  }

  remove() {
    if (this.editable) {
      this.service.setCurrentTradeItem(this.item);
      this.navigationService.openPopup(TradePopupsNames.RemoveItem);
    }
  }
}
