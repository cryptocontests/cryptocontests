import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'mat-tabs-toolbar',
  templateUrl: './mat-tabs-toolbar.component.html',
  styleUrls: ['./mat-tabs-toolbar.component.css']
})
export class MatTabsToolbarComponent implements OnInit {

  @ViewChild('toolbar')
  content: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
