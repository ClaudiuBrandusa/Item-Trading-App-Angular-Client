import { Injectable } from '@angular/core';
import { IdentityPage } from '../enums/identity-page';

@Injectable()
export class CurrentIdentityPageService {
  currentPage: IdentityPage = 0;

  constructor() { }

  setPage(page: IdentityPage) {
    this.currentPage = page;
  }
}
