import { Component, OnInit, Input, ElementRef, ViewChild, DoCheck } from '@angular/core';
import { TemplatePortal, CdkPortal } from '@angular/cdk/portal';
import { ListKeyManagerOption } from '@angular/cdk/a11y';
import { trigger, state, animate, style, transition } from '@angular/animations';
import { galleryPageAnimations } from '../gallery-page-animations';

export type GalleryPagePositionState =
  'left' | 'center' | 'right' | 'left-origin-center' | 'right-origin-center';
const ANIMATION_TIME = '500ms cubic-bezier(0.35, 0, 0.25, 1)';

@Component({
  selector: 'gallery-page',
  templateUrl: './gallery-page.component.html',
  animations: [trigger('translatePage', [
  // Note: transitions to `none` instead of 0, because some browsers might blur the content.
  state('center, void, left-origin-center, right-origin-center', style({ transform: 'none' })),
  state('left', style({ transform: 'translate3d(-100%, 0, 0)', opacity: 0 })),
  state('right', style({ transform: 'translate3d(100%, 0, 0)', opacity: 0 })),
  transition('* => left, * => right, left => center, right => center',
    animate(ANIMATION_TIME)),
  transition('void => left-origin-center', [
    style({ transform: 'translate3d(-100%, 0, 0)' }),
    animate(ANIMATION_TIME)
  ]),
  transition('void => right-origin-center', [
    style({ transform: 'translate3d(100%, 0, 0)' }),
    animate(ANIMATION_TIME)
  ])
])]
})
export class GalleryPageComponent implements OnInit, ListKeyManagerOption {

  @ViewChild(CdkPortal)
  public content: CdkPortal;

  @Input()
  set position(position: number) {
    if (position < 0) {
      this._position = 'left';
    } else if (position > 0) {
      this._position = 'right';
    } else {
      this._position = 'center';
    }
  }
  _position: GalleryPagePositionState;

  @Input()
  set origin(origin: number) {
    if (origin == null) { return; }
    if (origin <= 0) {
      this._origin = 'left';
    } else {
      this._origin = 'right';
    }
  }
  private _origin: GalleryPagePositionState;

  // From ListKeyManagerOption
  disabled = false;

  constructor(private elementRef: ElementRef) {
    //setInterval(() => this.translationX = 0, 100);
  }

  ngOnInit() {
    if (this._position == 'center' && this._origin) {
      this._position = this._origin == 'left' ? 'left-origin-center' : 'right-origin-center';
    }
  }

  _onTranslateTabStarted($event) {
    // console.log($event)
  }

}