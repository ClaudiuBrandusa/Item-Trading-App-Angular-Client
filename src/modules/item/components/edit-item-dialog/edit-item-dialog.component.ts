import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Item } from 'src/modules/item/models/responses/item';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { ItemService } from '../../services/item.service';
import { ItemEvents } from '../../enums/item-events';
import { EventData } from '../../../shared/utils/event-data';
import { NavigationService } from '../../../shared/services/navigation.service';

@Component({
  selector: 'dialog-edit-item',
  templateUrl: './edit-item-dialog.component.html',
  styleUrls: ['./edit-item-dialog.component.css']
})
export class EditItemDialogComponent implements OnInit {

  item: Item = null;
  
  constructor(private fb: FormBuilder, private service: ItemService, protected eventBus: EventBusService, private navigationService: NavigationService) {}

  form = this.fb.group({
    itemId: new FormControl('', Validators.required),
    itemName: new FormControl('', Validators.required),
    itemDescription: new FormControl('', null)
  })
  
  ngOnInit() {
    const itemId = this.service.getSelectedItemId();

    if (!!!itemId) {
      this.exit();
      return;
    }
    
    this.service.getItem(itemId).subscribe({
      next: (response) => {
        this.item = response;
        this.form.controls["itemId"].setValue(this.item.id);
        this.form.controls["itemName"].setValue(this.item.name);
        this.form.controls["itemDescription"].setValue(this.item.description);
      },
      error: (error) => {
        console.log('Error at get item found: ', error);
      }
    });
  } 
  
  submit() {
    this.form.controls["itemId"].setValue(this.item.id);
    this.service.updateItem(this.form).subscribe({
      next: (_response) => {
        this.eventBus.emit(new EventData(ItemEvents.UpdateItem+this.item.id, ''));
        this.exit();
      },
      error: (error) => {
        console.log('Error at update item found: ', error);
      }
    });
  }

  exit() {
    this.service.deselect();
    this.navigationService.back();
  }
}
