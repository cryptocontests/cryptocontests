import { Component, OnInit } from '@angular/core';
import { overlayAnimation } from '../../animations';
import { Portal } from '@angular/cdk/portal';

@Component({
  selector: 'app-overlay-card',
  templateUrl: './overlay-card.component.html',
  styleUrls: ['./overlay-card.component.css'],
  animations: [overlayAnimation]
})
export class OverlayCardComponent implements OnInit {

  content: Portal<any>;
  constructor() { }

  ngOnInit() {
  }

}