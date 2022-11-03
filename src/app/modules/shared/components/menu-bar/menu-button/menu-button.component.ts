import { Component, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventData } from 'src/app/models/utils/event';
import { DialogEventsId } from '../../../enums/dialog-events-id.enum';
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

  private onSelectSubscription: Subscription;
  private onDeselectDialogSubscription: Subscription;
  
  constructor(protected eventBusService: EventBusService) { }


  ngOnInit(): void {
    this.initEvents();
    
    this.checkIfIsSelected();
  }
  
  ngOnDestroy(): void {
    this.clearEvents();
  }

  protected initEvents() {
    if(!this.onSelectSubscription)
        this.onSelectSubscription = this.eventBusService.on(this.eventId, () => {
          this.select();
      });

    if(!this.onDeselectDialogSubscription)
      this.onDeselectDialogSubscription = this.eventBusService.on(DialogEventsId.Exit + this.eventId, () => {
        this.deselect();
      });
  }

  protected clearEvents() {
    if(this.onSelectSubscription) {
      this.onSelectSubscription.unsubscribe();
      this.onSelectSubscription = null;
    }

    if(this.onDeselectDialogSubscription) {
      this.onDeselectDialogSubscription.unsubscribe();
      this.onDeselectDialogSubscription = null;
    }
  }

  @HostListener('click', ['$event'])
  async click(_e) {
    await this.select();
  }

  protected async select() {
    if(this.selected)
      return; // then we cannot use this button
    
    await this.onSelect();

    if(this.hasEventId())
      this.announceSelection();
    // then we mark the current button as selected
    this.selected = true;
  }

  protected async deselect() {
    if(!this.selected)
      return;
    
    await this.onDeselect();

    this.selected = false;
  }

  protected announceSelection() {
    this.eventBusService.emit(new EventData(this.eventId, null));
  }

  private checkIfIsSelected(): void {
    if(this.isSelected()) {
      this.select();
    }
  }

  private hasEventId() {
    return this.eventId != "";
  }

  protected isSelected() {
    return false;
  }

  protected onSelect() {}

  protected onDeselect() {}
}
