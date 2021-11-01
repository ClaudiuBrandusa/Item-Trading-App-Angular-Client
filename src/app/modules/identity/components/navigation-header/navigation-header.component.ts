import { Component, OnInit } from '@angular/core';
import { IdentityPage } from 'src/app/models/enums/identity-page';
import { CurrentIdentityPageService } from '../../services/current-identity-page.service';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.css']
})
export class NavigationHeaderComponent implements OnInit {

  public disabledAnchorClasses = "disabled color-black";
  public enabledAnchorClasses = "color-white";
  private enabledDivClasses = "border-normal border-red border-top";
  public enabledLeftDivClasses = this.enabledDivClasses + " border-left border-radius-rounded-top-left";
  public enabledRightDivClasses = this.enabledDivClasses + " border-right border-radius-rounded-top-right";
  private disabledDivClasses = "bg-sizzling-red border-bottom border-normal border-red";
  public disabledLeftDivClasses = this.disabledDivClasses + " border-right border-radius-rounded-top-left";
  public disabledRightDivClasses = this.disabledDivClasses + " border-left border-radius-rounded-top-right";

  constructor(private currentIdentityPageService: CurrentIdentityPageService) { }

  ngOnInit(): void {
  }

  isOnPage(page: IdentityPage) {
    return this.currentIdentityPageService.currentPage == page;
  }

  setPage(page: IdentityPage) {
    this.currentIdentityPageService.setPage(page);
  }

}
