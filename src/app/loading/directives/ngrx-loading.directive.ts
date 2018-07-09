import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  Type,
  ElementRef,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { BaseLoading, TemplateInput } from './base-loading';
import { Actions, Effect } from '@ngrx/effects';
import {
  switchMap,
  filter,
  map,
  tap,
  withLatestFrom,
  merge,
  skip,
  take,
  skipUntil,
  share
} from 'rxjs/operators';
import { Observable, combineLatest, range } from 'rxjs';
import { ActionsSubject } from '@ngrx/store';
import { NgrxService } from '../services/ngrx.service';

@Directive({
  selector: '[ngrxLoading]'
})
export class NgrxLoadingDirective extends BaseLoading
  implements OnInit {
  @Input('ngrxLoading') ngrxLoading: Observable<any>;
  @Input() ngrxLoadingError: TemplateInput;
  @Input() ngrxLoadingEmpty: TemplateInput;

  initAction = '@ngrx/store/init';

  constructor(
    private actions$: Actions,
    private ngrxService: NgrxService,
    private actionSubject: ActionsSubject,
    protected elementRef: ElementRef,
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(
      elementRef,
      templateRef,
      viewContainer,
      componentFactoryResolver
    );
  }

  getCustomEmpty() {
    return this.ngrxLoadingEmpty;
  }

  getCustomError() {
    return this.ngrxLoadingError;
  }

  ngOnInit() {
    this.bindObservable(
      combineLatest(
        this.actions$,
        this.ngrxLoading
      ).pipe(
        tap(console.log),
        map(([first, second]) => second)
      )
    );
  }
}
