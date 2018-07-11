import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ElementRef,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { BaseLoading, TemplateInput } from './base-loading';
import {
  filter,
  map
} from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { ActionsSubject } from '@ngrx/store';
import { LoadingAction } from '../ngrx-loading.action';

@Directive({
  selector: '[ngrxLoading]'
})
export class NgrxLoadingDirective extends BaseLoading {
  @Input('ngrxLoading') set ngrxLoading(observable: Observable<any>) {
    this.bindNgrxObservable(observable);
  }
  @Input() ngrxLoadingAction: LoadingAction;
  @Input() ngrxLoadingError: TemplateInput;
  @Input() ngrxLoadingEmpty: TemplateInput;

  initAction = '@ngrx/store/init';

  constructor(
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

  bindNgrxObservable(observable: Observable<any>) {
    this.bindObservable(
      combineLatest(
        observable,
        this.actionSubject.pipe(
          filter((action) => action.hasOwnProperty('originAction')
            && action['originAction'] === this.ngrxLoadingAction)
        )
      ).pipe(
        map(([first, second]) => first)
      )
    );
  }
}
