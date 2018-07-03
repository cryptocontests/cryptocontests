import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-empty',
  templateUrl: './loading-empty.component.html',
  styleUrls: ['./loading-empty.component.css']
})
export class LoadingEmptyComponent {

  @Input() emptyMessage = 'The search returned no results';

  constructor() { }
}
