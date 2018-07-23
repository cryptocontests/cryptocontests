import { Component, OnInit, Input } from '@angular/core';
import { Candidature } from '../../state/contest.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'cc-candidature-grid',
  templateUrl: './candidatures-grid.component.html',
  styleUrls: ['./candidatures-grid.component.css']
})
export class CandidaturesGridComponent implements OnInit {
  @Input('candidatures') candidatures: Candidature[];

  constructor() {}

  ngOnInit() {}
}
