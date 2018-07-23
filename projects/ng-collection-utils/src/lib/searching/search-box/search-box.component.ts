import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
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
        animate('100ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition(':leave', [
        animate(
          '100ms cubic-bezier(0.25, 0.8, 0.25, 1)',
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

  searchValue: string;

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

  onBlur($event) {
    if (!this.searchValue) {
      this.toggleExpanded();
    }
  }

  animationEnded($event) {
    this.inputAnimationEnded = !this.inputAnimationEnded;
    this.changeDetectionRef.detectChanges();
  }
}
