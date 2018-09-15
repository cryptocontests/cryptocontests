import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { ESCAPE } from '@angular/cdk/keycodes';
import { ViewEncapsulation } from '@angular/core';
import { transition, trigger, animate, style } from '@angular/animations';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { debounce, debounceTime, tap } from 'rxjs/operators';

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
  @Input()
  placeholder = 'Search';
  @Input()
  debounceMs = 300;
  @Output()
  searchChange = new EventEmitter<string>();
  expanded = false;
  expandable = true;
  inputAnimationEnded = true;

  @ViewChild('container')
  container: ElementRef<any>;

  @ViewChild('searchInput')
  searchInput: ElementRef<any>;

  @Input()
  searchValue: string;
  subscription: Subscription;

  constructor(private changeDetectionRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.searchValue) this.toggleExpanded();
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    setTimeout(() => {
      if (this.expanded) {
        this.container.nativeElement.querySelector('input').focus();
        this.subscription = fromEvent(this.searchInput.nativeElement, 'keyup')
          .pipe(debounceTime(this.debounceMs))
          .subscribe(() => this.searchChange.emit(this.searchValue));
        this.searchChange.emit(this.searchValue);
      } else {
        this.searchChange.emit('');
        this.subscription.unsubscribe();
      }
    });
  }

  onKeydown($event) {
    if ($event.keyCode === ESCAPE && this.expanded) this.toggleExpanded();
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
