import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EventData } from 'src/app/models/utils/event';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'dialog-create-item',
  templateUrl: './create-item-dialog.component.html',
  styleUrls: ['./create-item-dialog.component.css']
})
export class CreateItemDialogComponent implements OnInit, OnDestroy {

  onHideSubscription: Subscription;

  constructor(private fb: FormBuilder, private service: ItemService, private eventBus: EventBusService) { }

  form = this.fb.group({
    itemName: new FormControl('', Validators.required),
    itemDescription: new FormControl('', null)
  });

  ngOnInit() {
    if(!this.onHideSubscription) {
      this.onHideSubscription = this.eventBus.on("exit_dialog", () => {
        this.form.reset();
      });
    }
  }  
  
  ngOnDestroy() {
    if(this.onHideSubscription != null) {
      this.onHideSubscription.unsubscribe();
      this.onHideSubscription = null;
    }
  }

  async submit() {
    let result = await this.service.createItem(this.form);
    if(result)
      this.cancelDialog();
  }

  private cancelDialog() {
    this.eventBus.emit(new EventData("exit_dialog", null));
  }
}
