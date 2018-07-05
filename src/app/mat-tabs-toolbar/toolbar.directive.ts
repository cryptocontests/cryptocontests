import { Directive, ElementRef, ViewChild, OnInit, ViewContainerRef, TemplateRef, ContentChild } from '@angular/core';
import { MatTabsToolbarComponent } from './mat-tabs-toolbar/mat-tabs-toolbar.component';
import { MatTabHeader } from '@angular/material';

@Directive({
  selector: '[toolbar]'
})
export class ToolbarDirective implements OnInit {

  @ContentChild(MatTabsToolbarComponent)
  tabsToolbar: MatTabsToolbarComponent;

  @ViewChild(MatTabHeader)
  header: MatTabHeader;

  constructor(public viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.header._tabListContainer.nativeElement.innerHTML += this.tabsToolbar.content.elementRef.nativeElement.innerHTML;
  }

}
