import { Component, OnInit, Input } from '@angular/core';
import { Candidature } from '../../state/contest.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../state/contest.reducer';
import { VoteCandidature } from '../../state/contest.actions';

@Component({
  selector: 'cc-candidature-grid',
  templateUrl: './candidatures-grid.component.html',
  styleUrls: ['./candidatures-grid.component.css']
})
export class CandidaturesGridComponent implements OnInit {
  @Input()
  isUserJudge: boolean;
  @Input()
  contestHash: string;
  @Input('candidatures')
  candidatures: Candidature[];

  constructor(private store: Store<State>) {}

  ngOnInit() {}

  voteCandidature(candidatureHash: string) {
    this.store.dispatch(
      new VoteCandidature({
        contestHash: this.contestHash,
        candidatureHash: candidatureHash
      })
    );
  }
}
