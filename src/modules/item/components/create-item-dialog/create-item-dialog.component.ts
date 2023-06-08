import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { ItemEvents } from '../../enums/item-events';
import { ItemService } from '../../services/item.service';
import { NavigationService } from '../../../shared/services/navigation.service';
import { EventData } from '../../../shared/utils/event-data';

@Component({
  selector: 'dialog-create-item',
  templateUrl: './create-item-dialog.component.html',
  styleUrls: ['./create-item-dialog.component.css']
})
export class CreateItemDialogComponent {

  constructor(private fb: FormBuilder, private service: ItemService, private eventBus: EventBusService, private navigationService: NavigationService) {}

  form = this.fb.group({
    itemName: new FormControl('', Validators.required),
    itemDescription: new FormControl('', null)
  });

  submit() {
    this.service.createItem(this.form).subscribe({
      next: (response: any) => {
        this.eventBus.emit(new EventData(ItemEvents.CreateItem, response.itemId.toString()));
        this.exit();
      },
      error: (error) => {
        console.log('Error at create item found: ', error);
      }
    });
  }
  
  exit() {
    this.navigationService.back();
  }
}
