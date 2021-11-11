import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/models/response/item/item';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input()
  itemId = "";

  @Input()
  item = new Item();

  constructor(private service: ItemService) { }

  ngOnInit(): void {
    this.getItem();
  }

  async getItem() {
    this.item = await this.service.getItem(this.itemId);
  }

}
