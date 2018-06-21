import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Contest } from '../../state/contest.model';

@Component({
  selector: 'cc-contest-grid',
  templateUrl: './contest-grid.component.html',
  styleUrls: ['./contest-grid.component.css']
})
export class ContestGridComponent {
  @Input('contests') contests: Contest[];
  @Output('contestSelected') contestSelected = new EventEmitter<string>();

  constructor() {}

  selectContest(contest: Contest) {
    this.contestSelected.emit(contest.id);
  }
}
