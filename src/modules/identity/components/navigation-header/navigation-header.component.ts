import { Component } from '@angular/core';
import { IdentityPage } from '../../enums/identity-page';
import { CurrentIdentityPageService } from '../../services/current-identity-page.service';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.css']
})
export class NavigationHeaderComponent {

  public disabledAnchorClasses = "disabled color-black";
  public enabledAnchorClasses = "color-white";
  private enabledDivClasses = "border-normal border-dark-red border-style-solid border-bottom-0 ";
  public enabledLeftDivClasses = this.enabledDivClasses + "border-end-0 border-radius-rounded-top-left";
  public enabledRightDivClasses = this.enabledDivClasses + "border-start-0 border-radius-rounded-top-right";
  private disabledDivClasses = "bg-red border border-top-0 border-normal border-dark-red ";
  public disabledLeftDivClasses = this.disabledDivClasses + "border-start-0 border-radius-rounded-bottom-right border-radius-rounded-top-left";
  public disabledRightDivClasses = this.disabledDivClasses + "border-end-0 border-radius-rounded-bottom-left border-radius-rounded-top-right";

  public get loginButtonClasses() {
    return "d-flex flex-column flex-grow-1 p-2 text-center " + (this.isOnPage(0) ? this.enabledRightDivClasses : this.disabledRightDivClasses);
  }
  
  public get registerButtonClasses() {
    return "d-flex flex-column flex-grow-1 p-2 text-center " + (this.isOnPage(1) ? this.enabledLeftDivClasses : this.disabledLeftDivClasses);
  }

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
