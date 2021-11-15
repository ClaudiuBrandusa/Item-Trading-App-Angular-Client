import { Component, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from '../../../services/event-bus.service';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.css']
})
export class MenuButtonComponent implements OnInit, OnDestroy {

  @Input()
  eventId = "";

  @Output()
  selected = false;

  OnSelectSubscription: Subscription;

  constructor(protected eventBusService: EventBusService) { }


  ngOnInit(): void {
    this.initOnSelection();
    
  }
  
  ngOnDestroy(): void {
    this.clearOnSelection();
  }

  @HostListener('click', ['$event'])
  async click(e) {
    await this.select();
  }

  private async select() {
    if(this.selected)
      return; // then we cannot use this button
    
    await this.onSelect();

    if(this.hasEventId())
      this.eventBusService.emit(new EventData(this.eventId, null));
    // then we mark the current button as selected
    this.selected = true;
  }

  private initOnSelection() {
    if(!this.OnSelectSubscription)
      this.OnSelectSubscription = this.eventBusService.on(this.getAnnounceSelectionEventId(), () => {
        this.selected = false;
    });

    this.checkIfIsSelected();
  }

  private clearOnSelection() {
    if(this.OnSelectSubscription)
      this.OnSelectSubscription.unsubscribe();
  }

  protected announceSelection() {
    this.eventBusService.emit(new EventData(this.getAnnounceSelectionEventId(), null));
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
    return true;
  }

  protected onSelect() {}

  protected getAnnounceSelectionEventId() { return ""; }

}
