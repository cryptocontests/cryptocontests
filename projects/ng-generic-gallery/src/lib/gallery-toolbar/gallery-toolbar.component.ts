import { Component, ViewChild } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal'

@Component({
  selector: 'gallery-toolbar',
  templateUrl: './gallery-toolbar.component.html'
})
export class GalleryToolbarComponent {

  @ViewChild(CdkPortal)
  public content: CdkPortal;

  constructor() { }

}