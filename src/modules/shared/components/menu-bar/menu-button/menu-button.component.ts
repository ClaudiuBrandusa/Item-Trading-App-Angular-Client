import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DialogEvents } from '../../../enums/dialog-events.enum';
import { EventBusService } from '../../../services/event-bus.service';
import { NavigationService } from '../../../services/navigation.service';
import { EventBusUtils } from '../../../utils/event-bus.utility';
import { EventData } from '../../../utils/event-data';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.css']
})
export class MenuButtonComponent implements OnInit, OnDestroy {

  @Input()
  eventId: string;

  @Input()
  route: string = "";

  @Output()
  selected = false;

  @Output()
  onClick = new EventEmitter<boolean>(); // boolean value represents the state of the button selection
  
  private eventBusUtility: EventBusUtils;
  private locked = false;
  
  protected openSubscriptionId: string;
  protected exitSubscriptionId: string;
  protected openEventId: string;
  protected exitEventId: string;
  protected allowDeselectOnClick: boolean = true;

  constructor(protected eventBusService: EventBusService, protected navigationService: NavigationService) {
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
    if (this.route === "")
      this.route = this.eventId;
    if (!this.openSubscriptionId)
      this.openSubscriptionId = `${DialogEvents.Open}/${this.eventId}`;
    if (!this.exitSubscriptionId)
      this.exitSubscriptionId = `${DialogEvents.Exit}/${this.eventId}`;
    if (!this.openEventId)
      this.openEventId = DialogEvents.Open;
    if (!this.exitEventId)
      this.exitEventId = DialogEvents.Exit;

    this.eventBusUtility.on(this.openSubscriptionId, (_data) => {
      this.select(false);
    });
    
    this.eventBusUtility.on(this.exitSubscriptionId, (_data) => {
      this.deselect();
    });
  }

  @HostListener('click', ['$event'])
  async click(_e) {
    if (this.locked || (!this.allowDeselectOnClick && this.selected)) return;
    this.locked = true;
    if (this.selected) {
      this.deselect();
    } else {
      this.select();
    }
    if (this.allowDeselectOnClick) setTimeout(() => this.locked = false, 100);
  }

  protected async select(announceSelection = true, withNavigation = true) {
    if(this.selected) {
      return;
    }
    
    this.onSelect();
    this.onClick.emit(true);
    if (withNavigation && !await this.navigate()) return;
    
    this.selected = true;
    
    if (announceSelection) this.eventBusService.emit(new EventData(this.openEventId, this.eventId));
  }

  protected async deselect() {
    if(!this.selected) {
      return;
    }

    this.onClick.emit(false);
    this.selected = false;
    this.locked = false;
  }

  private checkIfIsSelected(): void {
    if(this.shouldSelect()) {
      this.select(false, false);
    }
  }

  protected shouldSelect() {
    return this.navigationService.currentRoute === this.eventId;
  }

  protected isLocked() {
    return this.locked;
  }

  protected async navigate() {
    return await this.navigationService.navigate(this.route, true);
  }

  protected onSelect() {
    this.eventBusUtility.emit(`${this.exitEventId}/${this.navigationService.currentRoute}`, null);
  }
}
