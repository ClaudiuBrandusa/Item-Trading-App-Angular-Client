import { Component, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventData } from 'src/app/models/utils/event';
import { DialogEvents } from '../../../enums/dialog-events.enum';
import { EventBusService } from '../../../services/event-bus.service';

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

  private locked = false;

  private onSelectSubscription: Subscription;
  private onDeselectDialogSubscription: Subscription;
  
  protected openSubscriptionId: string;
  protected exitSubscriptionId: string;
  protected openEventId: string;

  constructor(protected eventBusService: EventBusService) { }


  ngOnInit(): void {
    this.initEvents();
    
    this.checkIfIsSelected();
  }
  
  ngOnDestroy(): void {
    this.clearEvents();
  }

  protected initEvents() {
    if (!this.openSubscriptionId)
      this.openSubscriptionId = `${DialogEvents.Open}/${this.eventId}`;
    if (!this.exitSubscriptionId)
      this.exitSubscriptionId = `${DialogEvents.Exit}/${this.eventId}`;
    if (!this.openEventId)
      this.openEventId = DialogEvents.Open;

    this.onSelectSubscription = this.eventBusService.on(this.openSubscriptionId, (_data) => {
      this.select();
    })

    this.onDeselectDialogSubscription = this.eventBusService.on(this.exitSubscriptionId, (_data) => {
      this.deselect();
    })
  }

  protected clearEvents() {
    this.onSelectSubscription && this.eventBusService.clearSubscription(this.onSelectSubscription);
    this.onDeselectDialogSubscription && this.eventBusService.clearSubscription(this.onDeselectDialogSubscription);
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
