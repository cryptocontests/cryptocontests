import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Judge } from '../../state/contest.model';

@Component({
  selector: 'cc-judges-list',
  templateUrl: './judges-list.component.html',
  styleUrls: ['./judges-list.component.css']
})
export class JudgesListComponent implements OnInit {
  @Input()
  judges: Judge[];
  @Output()
  removeJudge = new EventEmitter<Judge>();

  constructor() {}

  ngOnInit() {}

  initRemoveJudge(judge: Judge) {
    this.removeJudge.emit(judge);
  }
}
