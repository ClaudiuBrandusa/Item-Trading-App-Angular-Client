import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../modules/shared/services/navigation.service';
import { DialogModule } from '../../../modules/dialog/dialog.module';

@Component({
  selector: 'app-warning',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './warning-popup.component.html',
  styleUrls: ['./warning-popup.component.css']
})
export class WarningPopupComponent {
  constructor(private navigationService: NavigationService) {}
  
  ok() {
    this.navigationService.closePopup();
  }
}
