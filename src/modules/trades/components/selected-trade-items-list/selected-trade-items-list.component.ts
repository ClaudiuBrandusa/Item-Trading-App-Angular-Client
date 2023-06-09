import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListDirective } from 'src/modules/shared/directives/list/list.directive';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { TradeItemEvents } from '../../enums/trade-item-events';
import { CurrentTrade } from '../../models/current-trade';
import { TradeItem } from '../../models/trade-item';
import { TradesService } from '../../services/trades.service';

@Component({
  selector: 'app-selected-trade-items-list',
  templateUrl: './selected-trade-items-list.component.html',
  styleUrls: ['./selected-trade-items-list.component.css']
})
export class SelectedTradeItemsListComponent extends ListDirective implements OnInit, OnDestroy {
  
  editAllowed = true;
  private eventBusUtility: EventBusUtils;
  
  constructor(eventBus: EventBusService, private service: TradesService) {
    super();
    this.eventBusUtility = new EventBusUtils(eventBus);
    this.getTradeItem.bind(this);
  }

  ngOnInit(): void {
    this.editAllowed = !!this.service.getCurrentTradeOffer();
    this.initSubscriptions();
    this.listItems();
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
    this.clear();
  }

  getTradeItem (itemId: string): TradeItem | undefined {
    return this.service.getTradeItemById(itemId);
  }

  override clear() {
    super.clear();
    this.service.clearTradeItemsOfTradeOffer();
  }

  private listItems() {
    const list = this.service.getCurrentTradeItemsIds();
    this.addList(list);
  }

  // Subscriptions

  private initSubscriptions() {
    if (this.editAllowed) {
      this.eventBusUtility.on(TradeItemEvents.Add, (tradeItem: TradeItem) => {
        if (this.contains(tradeItem.id)) {
          // then we update the changes in the present component
          this.eventBusUtility.emit(TradeItemEvents.Update+tradeItem.id, tradeItem)
        } else {
          this.add(tradeItem.id);
          this.service.addItemToTradeOffer(tradeItem);
          this.eventBusUtility.emit(TradeItemEvents.ListChanged, null);
        }
      });
      
      this.eventBusUtility.on(TradeItemEvents.Remove, (value) => {
        if (value == null) {
          this.clear();
        } else {
          this.remove(value);
        }
        this.eventBusUtility.emit(TradeItemEvents.ListChanged, null);
      });
    }
  }
}
