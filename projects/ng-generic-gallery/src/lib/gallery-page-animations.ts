import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationTriggerMetadata,
} from '@angular/animations';

const ANIMATION_TIME = '500ms cubic-bezier(0.35, 0, 0.25, 1)';

export const galleryPageAnimations = trigger('translatePage', [
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
]);
