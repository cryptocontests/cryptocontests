import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { horizontalScale } from '../../animations';
import { ESCAPE } from '@angular/cdk/keycodes';
import { ViewEncapsulation } from '@angular/core';
import { transition, trigger, animate, style } from '@angular/animations';

@Component({
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css'],
  animations: [
    trigger('horizontalScale', [
      transition(':enter', [
        style({
          width: '32px'
        }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate(
          '300ms ease-out',
          style({
            width: '32px'
          })
        )
      ])
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class SearchBoxComponent implements OnInit {
  @Input() placeholder = 'Search';
  expanded = false;
  expandable = true;
  inputAnimationEnded = true;

  @ViewChild('container') container: ElementRef<any>;

  constructor(private changeDetectionRef: ChangeDetectorRef) {}

  ngOnInit() {}

  toggleExpanded() {
    this.expanded = !this.expanded;
    setTimeout(() => {
      if (this.expanded) {
        this.container.nativeElement.querySelector('input').focus();
      }
    });
  }

  onKeydown($event) {
    if ($event.keyCode === ESCAPE) this.expanded = false;
  }

  animationEnded($event) {
    this.inputAnimationEnded = !this.inputAnimationEnded;
    this.changeDetectionRef.detectChanges();
  }
}
