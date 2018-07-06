import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cc-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent {
  @Input('tags') tags: string[];
  @Input('clickable') clickable = true;
  @Output('tagClick') tagClick = new EventEmitter<string>();

  constructor() {}
}
