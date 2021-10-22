import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog',
  template: `<h1><ng-content></ng-content></h1>`,
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
