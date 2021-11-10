import { Component, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from '../../../services/event-bus.service';

@Component({
  selector: 'navbar-button',
  templateUrl: './navbar-button.component.html',
  styleUrls: ['./navbar-button.component.css']
})
export class NavbarButtonComponent implements OnInit, OnDestroy {

  @Input()
  route: string = null; // the route where the button leads on click

  @Output()
  selected = false;

  @Input()
  eventId = "";

  OnSelectSubscription: Subscription;

  constructor(private router: Router, private eventBusService: EventBusService) { }

  ngOnInit(): void {
    this.InitOnSelection();
    
  }
  
  ngOnDestroy(): void {
    this.ClearOnSelection();
  }

  @HostListener('click', ['$event'])
  async Click(e) {
    await this.Select();
  }

  private AnnounceSelection() {
    this.eventBusService.emit(new EventData("select_navbar_button", null));
  }

  private InitOnSelection() {
    if(!this.OnSelectSubscription)
      this.OnSelectSubscription = this.eventBusService.on("select_navbar_button", () => {
        this.selected = false;
        this.ngOnInit();
    });

    this.CheckIfIsSelected();
  }

  private ClearOnSelection() {
    if(this.OnSelectSubscription)
      this.OnSelectSubscription.unsubscribe();
  }

  private async Select() {
    if(this.selected)
      return; // then we cannot use this button
    
    if(this.route)
      await this.router.navigate([this.route]);
    this.AnnounceSelection();
    if(this.eventId != "")
      this.eventBusService.emit(new EventData(this.eventId, null));
    // then we mark the current button as selected
    this.selected = true;
  }

  private CheckIfIsSelected() {
    if(this.router.url.slice(1) === this.route) {
      this.Select();
    }
  }
}
