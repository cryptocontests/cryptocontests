import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading-error',
  templateUrl: './loading-error.component.html',
  styleUrls: ['./loading-error.component.css']
})
export class LoadingErrorComponent {

  @Input() customMessage = 'There was an error getting the results';

  constructor() { }
}
