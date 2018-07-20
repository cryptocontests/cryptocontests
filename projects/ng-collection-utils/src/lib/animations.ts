import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationTriggerMetadata
} from '@angular/animations';

export const overlayAnimation: AnimationTriggerMetadata = trigger(
  'overlayMenu',
  [
    state(
      'void',
      style({
        transform: 'scale(0)',
        opacity: 0
      })
    ),
    transition('void <=> *', [
      style({
        opacity: 0
      }),
      animate('150ms cubic-bezier(0.25, 0.8, 0.25, 1)')
    ])
  ]
);

export const horizontalScale: AnimationTriggerMetadata = trigger(
  'horizontalScale',
  [
    transition(':enter', [
      style({
        transform: 'translateX(100%)'
      }),
      animate('1000ms cubic-bezier(0.25, 0.8, 0.25, 1)')
    ]),
    transition(':leave', [
      animate(
        '1000ms cubic-bezier(0.25, 0.8, 0.25, 1)',
        style({
          transform: 'translateX(100%)'
        })
      )
    ])
  ]
);

export const filterAnimation: AnimationTriggerMetadata = trigger('filter', [
  transition(':enter', [
    style({
      transform: 'translateY(-100%)',
      opacity: 0
    }),
    animate('100ms cubic-bezier(0.25, 0.8, 0.25, 1)')
  ]),
  transition(':leave', [
    animate(
      '100ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      style({
        transform: 'translateY(-100%)',
        opacity: 0
      })
    )
  ])
]);
