import { Input, ElementRef, TemplateRef, ViewContainerRef, ComponentFactoryResolver, Type, ComponentRef } from '@angular/core';
import { LoadingComponent } from '../components/loading/loading.component';
import { Observable, Subscription } from 'rxjs';
import { LoadingEmptyComponent } from '../components/loading-empty/loading-empty.component';
import { LoadingErrorComponent } from '../components/loading-error/loading-error.component';
import { skip } from 'rxjs/operators';

export type TemplateInput = TemplateRef<any> | Type<any> | string;

export abstract class BaseLoading {

  private subscription: Subscription;

  constructor(
    protected elementRef: ElementRef,
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.showLoading();
  }

  abstract getCustomError(): TemplateInput;
  abstract getCustomEmpty(): TemplateInput;

  protected isEmpty(value) {
    return !value || ((length in value || Array.isArray(value)) && value.length === 0);
  }

  protected bindObservable(observable: Observable<any>) {
    this.showLoading();
    this.subscription = observable.subscribe(
      value => this.showValue(value),
      error => this.showError()
    );
  }

  protected showValue(value) {
    if (this.isEmpty(value)) this.showEmpty();
    else this.showTemplate(this.templateRef);
    if (this.subscription) this.subscription.unsubscribe();
  }

  protected showError() {
    if (this.getCustomError() instanceof TemplateRef || this.getCustomError() instanceof Type) {
      this.showTemplateInput(this.getCustomError());
    } else {
      this.showTemplateInput(LoadingErrorComponent, <string>this.getCustomError());
    }
    if (this.subscription) this.subscription.unsubscribe();
  }

  protected showLoading() {
    this.showComponent(LoadingComponent);
  }

  protected showEmpty() {
    if (this.getCustomEmpty() instanceof TemplateRef || this.getCustomEmpty() instanceof Type) {
      this.showTemplateInput(this.getCustomEmpty());
    } else {
      this.showTemplateInput(LoadingEmptyComponent, <string>this.getCustomEmpty());
    }
  }

  protected showTemplateInput(toShow: TemplateInput, customMessage: string = null) {
    let component;

    if (toShow instanceof TemplateRef) component = this.showTemplate(toShow);
    else if (toShow instanceof Type) component = this.showComponent(toShow);

    if (customMessage) component.instance.customMessage = customMessage;
  }

  private showComponent(component: Type<any>): ComponentRef<any> {
    this.viewContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return this.viewContainer.createComponent(componentFactory);
  }

  private showTemplate(templateRef: TemplateRef<any>) {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(templateRef);
  }

}
