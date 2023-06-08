import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { InventoryEvents } from '../../enums/InventoryEvents';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { InventoryService } from '../../services/inventory.service';
import { ItemError } from '../../../shared/models/errors/item-error';
import { EventData } from '../../../shared/utils/event-data';
import { NavigationService } from '../../../shared/services/navigation.service';

@Component({
  selector: 'dialog-drop-item-quantity',
  templateUrl: './drop-item-quantity-dialog.component.html',
  styleUrls: ['./drop-item-quantity-dialog.component.css']
})
export class DropItemQuantityDialogComponent implements OnInit {

  _itemName

  @Output()
  get itemName() {
    return this._itemName;
  }

  @Output()
  errorMessage: string;

  constructor(private fb: FormBuilder, private service: InventoryService, private eventBus: EventBusService, private navigationService: NavigationService) {}

  form = this.fb.group({
    itemQuantity: new FormControl('', Validators.required)
  })

  ngOnInit() {
    this.loadItemName();
  }

  next() {
    this.service.dropItem(this.form).subscribe({
      next: (_response) => {
        this.errorMessage = '';
        this.eventBus.emit(new EventData(InventoryEvents.Refresh, ''));
        this.exit();
      },
      error: (error: ItemError) => {
        if (error.errorCode == 400)
          this.errorMessage = error.message;
      }
    });
  }

  loadItemName() {
    this.service.getItem(this.service.getSelectedItemId()).subscribe({
      next: (response: any) => {
        this._itemName = response.itemName;
      },
      error: (_error) => {
        this.exit();
      }
    });
  }

  exit() {
    this.service.deselect();
    this.navigationService.back();
  }
}
