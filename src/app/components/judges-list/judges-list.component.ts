import { Component, OnInit, Input } from '@angular/core';
import { Judge } from '../../state/contest.model';

@Component({
  selector: 'cc-judges-list',
  templateUrl: './judges-list.component.html',
  styleUrls: ['./judges-list.component.css']
})
export class JudgesListComponent implements OnInit {
  @Input() judges: Judge[];

  constructor() {}

  ngOnInit() {}

  removeJudge(judge: Judge) {}
}
