import { Component, OnInit, Input } from '@angular/core';
import { Candidature } from '../../state/contest.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../state/contest.reducer';
import {
  VoteCandidature,
  CancelCandidature
} from '../../state/contest.actions';
import { CancelCandidatureComponent } from '../cancel-candidature/cancel-candidature.component';
import { MatDialog } from '@angular/material';

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
  @Input()
  contestPhase: number;
  selectedCandidature: number = undefined;

  constructor(private store: Store<State>, private dialog: MatDialog) {}

  ngOnInit() {}

  voteCandidature(candidatureHash: string) {
    this.store.dispatch(
      new VoteCandidature({
        contestHash: this.contestHash,
        candidatureHash: candidatureHash
      })
    );
  }

  cancelCandidature(candidatureHash: string) {
    const dialogRef = this.dialog.open(CancelCandidatureComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(
          new CancelCandidature({
            contestHash: this.contestHash,
            candidatureHash: candidatureHash,
            reasonForCancellation: result
          })
        );
      }
    });
  }

  isVotingEnabled(): boolean {
    return this.isUserJudge && this.contestPhase === 2;
  }
}
