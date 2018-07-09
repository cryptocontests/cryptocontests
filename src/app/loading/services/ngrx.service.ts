import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgrxService {

  firstAction = true;

  constructor() { }

  isFirstAction() {
    console.log('isfirstaction');
    return this.firstAction;
  }

  registerAction() {

    console.log('registeraction');
    this.firstAction = false;
  }
}
