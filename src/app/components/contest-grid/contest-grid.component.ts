import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Contest } from '../../state/contest.model';
import { Observable } from 'rxjs';
import { ContestActionTypes, LoadedContests } from '../../state/actions/contest.actions';
import { cardAnimations } from '../card.animations';

@Component({
  selector: 'cc-contest-grid',
  templateUrl: './contest-grid.component.html',
  styleUrls: ['./contest-grid.component.css'],
  animations: cardAnimations
})
export class ContestGridComponent {
  @Input('contests') contests: Contest[];
  @Output('contestSelected') contestSelected = new EventEmitter<string>();

  constructor() {}

  selectContest(contest: Contest) {
    this.contestSelected.emit(contest.id);
  }
}
