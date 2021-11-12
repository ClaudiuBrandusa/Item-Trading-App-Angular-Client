import { Component, OnInit, Output } from '@angular/core';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit {

  @Output()
  itemsIdList = new Array<string>();

  constructor(private service: ItemService) { }

  async ngOnInit(): Promise<void> {
    this.listItems();
  }

  async listItems(searchString: string = "") {
    let list = await this.service.listItems(); /* list of items id */
  
    if(list == null)
      return;

      this.clearList();

    list.forEach(async element => {
      this.itemsIdList.push(element);
    });
  }

  clearList() {
    while(this.itemsIdList.length > 0) {
      this.itemsIdList.pop();
    }
  }

  getEventValue(event: Event) {
    let str = event as unknown as string;
    if(str != null)
      return str;
    return (event.target as HTMLInputElement).value;
  }

}
