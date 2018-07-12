import { Component, ChangeDetectorRef, ApplicationRef } from '@angular/core';

@Component({
  selector: 'filter-toolbar',
  templateUrl: './filter-toolbar.component.html',
  styleUrls: ['./filter-toolbar.component.css']
})
export class FilterToolbarComponent {
  show = true;

  constructor(
    private appRef: ApplicationRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  setShow(_show: boolean) {
    this.show = _show;
  }

  toggle() {
    this.show = !this.show;
    this.changeDetector.detectChanges();
    this.appRef.tick();
  }
}
