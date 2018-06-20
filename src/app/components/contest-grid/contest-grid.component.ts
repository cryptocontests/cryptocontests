import { Component, OnInit, Input } from '@angular/core';
import { Contest } from '../../state/contest.model';

@Component({
  selector: 'cc-contest-grid',
  templateUrl: './contest-grid.component.html',
  styleUrls: ['./contest-grid.component.css']
})
export class ContestGridComponent implements OnInit {
  @Input('contests') contests: Contest[];

  constructor() {}

  ngOnInit() {}
}
