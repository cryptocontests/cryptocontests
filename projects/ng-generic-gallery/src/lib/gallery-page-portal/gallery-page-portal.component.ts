import { Component, OnInit } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { trigger, state, animate, style, transition } from '@angular/animations';

@Component({
  selector: 'gallery-page-portal',
  templateUrl: './gallery-page-portal.component.html',
  styleUrls: ['./gallery-page-portal.component.css'],
  animations: [
    trigger('page', [
      state('left', style({
//        transform: 'translateX(-100%)'
      })),
      state('right', style({
  //      transform: 'translateX(100%)'
      })),
      state('center', style({
    //    transform: 'translateX(0%)'
      })),
      /* transition(':enter', [
        style({
          opacity: 0
        }),
        animate('1s ease')
      ]),
      transition(':leave', [
        animate('1s ease', style({
          opacity: 0
        }))
      ]), */
      transition('* => *', animate('500ms')),

      /*        (@flyInOut.start)="animationStarted($event)"
             /* ,
            transition('* => left', [
              style({ transform: 'translateX(-100%)' }),
              animate(100)
            ]),
            transition('* => right', [
              style({ transform: 'translateX(100%)' }),
              animate(100)
            ]) */
    ])
  ]
})
export class GalleryPagePortalComponent {
  leftPage: TemplatePortal;
  centerPage: TemplatePortal;
  rightPage: TemplatePortal;

  constructor() { }

  public setPages(leftPage: TemplatePortal, centerPage: TemplatePortal, rightPage: TemplatePortal) {
    this.leftPage = null;
    this.centerPage = null;
    this.rightPage = null;
    this.leftPage = leftPage;
    this.centerPage = centerPage;
    this.rightPage = rightPage;
    console.log(leftPage); console.log(centerPage); console.log(rightPage);
  }

}