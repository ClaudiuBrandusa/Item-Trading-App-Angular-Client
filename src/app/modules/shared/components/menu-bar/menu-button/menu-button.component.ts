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
  eventId: string;

  @Output()
  selected = false;

  private onSelectSubscription: Subscription;
  private onDeselectDialogSubscription: Subscription;
  
  constructor(protected eventBusService: EventBusService) { }


  ngOnInit(): void {
    this.initEvents();
  }
  
  ngOnDestroy(): void {
    this.clearEvents();
  }

  protected initEvents() {
    this.initOnSelection();
  }

  protected clearEvents() {
    this.clearOnSelection();
    this.clearOnDeselection();
  }

  @HostListener('click', ['$event'])
  async click(e) {
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

  private initOnSelection() {
    if(!this.onSelectSubscription)
      this.onSelectSubscription = this.eventBusService.on(this.eventId, () => {
        this.initOnDeselection();
    });

    this.checkIfIsSelected();
  }

  private initOnDeselection() {
    if(!this.onDeselectDialogSubscription)
      this.onDeselectDialogSubscription = this.eventBusService.on("exit_dialog", () => {
        this.deselect();
      });
  }

  private clearOnSelection() {
    if(this.onSelectSubscription) {
      this.onSelectSubscription.unsubscribe();
      this.onSelectSubscription = null;
    }
  }

  private clearOnDeselection() {
    if(this.onDeselectDialogSubscription) {
      this.onDeselectDialogSubscription.unsubscribe();
      this.onDeselectDialogSubscription = null;
    }
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
