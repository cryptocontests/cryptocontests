import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export const cardAnimations = [
  trigger('cardState', [
    state('void',
      style({
        transform: 'translateY(30px)',
        opacity: 0
      })
    ),
    transition(':enter', animate('200ms ease-in'))
    //transition('active => inactive', animate('100ms ease-out'))
  ])
];
