import { Component, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EventData } from 'src/app/models/utils/event';
import { DialogEvents } from '../../../enums/dialog-events.enum';
import { EventBusService } from '../../../services/event-bus.service';
import { EventBusUtils } from '../../../utils/event-bus.utility';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.css']
})
export class MenuButtonComponent implements OnInit, OnDestroy {

  @Input()
  eventId: string;

  @Output()
  selected = false;
  
  private eventBusUtility: EventBusUtils;

  private locked = false;
  
  protected openSubscriptionId: string;
  protected exitSubscriptionId: string;
  protected openEventId: string;

  constructor(protected eventBusService: EventBusService) {
    this.eventBusUtility = new EventBusUtils(eventBusService);
  }


  ngOnInit(): void {
    this.initEvents();
    
    this.checkIfIsSelected();
  }
  
  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  protected initEvents() {
    if (!this.openSubscriptionId)
      this.openSubscriptionId = `${DialogEvents.Open}/${this.eventId}`;
    if (!this.exitSubscriptionId)
      this.exitSubscriptionId = `${DialogEvents.Exit}/${this.eventId}`;
    if (!this.openEventId)
      this.openEventId = DialogEvents.Open;

    this.eventBusUtility.on(this.openSubscriptionId, (_data) => {
      this.select();
    })

    this.eventBusUtility.on(this.exitSubscriptionId, (_data) => {
      this.deselect();
    })
  }

  @HostListener('click', ['$event'])
  async click(_e) {
    this.announceSelection();
    this.locked = true;
    setTimeout(() => this.locked = false, 100);
  }

  protected async select() {
    if(this.selected) {
      return;
    }
    
    await this.onSelect();
      
    // then we mark the current button as selected
    this.selected = true;
  }

  protected async deselect() {
    if(!this.selected) {
      return;
    }
    
    await this.onDeselect();

    this.selected = false;
  }

  protected announceSelection() {
    this.eventBusService.emit(new EventData(this.openEventId, this.eventId));
  }

  private checkIfIsSelected(): void {
    if(this.isSelected()) {
      this.announceSelection();
    }
  }

  protected isSelected() {
    return false;
  }

  protected onSelect() {}

  protected onDeselect() {}
}
