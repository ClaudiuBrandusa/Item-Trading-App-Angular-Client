import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AddItemRequest } from 'src/modules/inventory/models/requests/add-item-request.model';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { InventoryService } from '../../services/inventory.service';
import { InventoryEvents } from '../../enums/inventory-events';
import { ItemService } from '../../../item/services/item.service';
import { ItemError } from '../../../shared/models/errors/item-error';
import { EventData } from '../../../shared/utils/event-data';
import { NavigationService } from '../../../shared/services/navigation.service';
import { InventoryRoutes } from '../../enums/inventory-routes';

@Component({
  selector: 'dialog-add-item-quantity',
  templateUrl: './add-item-quantity-dialog.component.html',
  styleUrls: ['./add-item-quantity-dialog.component.css']
})
export class AddItemQuantityDialogComponent implements OnInit {
  
  model = new AddItemRequest();
  _itemName

  @Output()
  get itemName() {
    return this._itemName;
  }

  @Output()
  errorMessage: string;

  constructor(private fb: FormBuilder, private service: InventoryService, private itemService: ItemService, protected eventBus: EventBusService, private navigationService: NavigationService) {}

  form = this.fb.group({
    itemQuantity: new FormControl('', Validators.required)
  })

  ngOnInit() {
    this.loadItemName();
  }

  next() {
    this.service.addItem(this.form).subscribe({
      next: (_response) => {
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
    this.itemService.getItem(this.service.getSelectedItemId()).subscribe({
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
    this.navigationService.backToRoute(InventoryRoutes.Base);
  }

  cancel() {
    this.service.deselect();
    this.service.selectItemState = true;
    this.navigationService.back();
  }
}
