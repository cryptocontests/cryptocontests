import { Directive, Input, ElementRef, TemplateRef, ViewContainerRef, ComponentFactoryResolver, Type, ComponentRef } from '@angular/core';
import { LoadingComponent } from './components/loading/loading.component';
import { Observable } from 'rxjs';
import { LoadingEmptyComponent } from './components/loading-empty/loading-empty.component';
import { LoadingErrorComponent } from './components/loading-error/loading-error.component';

@Directive({
  selector: '[asyncLoading]'
})
export class LoadingDirective {

  @Input() asyncLoadingError: TemplateRef<any> | Type<any> | string;
  @Input() asyncLoadingEmpty: TemplateRef<any> | Type<any> | string;

  @Input('asyncLoading') set asyncLoading(showLoadingSpinner: boolean | Observable<any>) {
    if (showLoadingSpinner instanceof Observable) this.bindObservable(showLoadingSpinner);
    else if (showLoadingSpinner) this.showComponent(LoadingComponent);
    else this.showTemplate(this.templateRef);
  }

  bindObservable(observable: Observable<any>) {
    this.showComponent(LoadingComponent);
    observable.subscribe((value) => {
        if (!this.asyncLoadingEmpty || value) this.valueReceived(value);
      }, (error) => {
        if (this.asyncLoadingError instanceof TemplateRef || this.asyncLoadingError instanceof Type) {
          this.showComponentOrTemplate(this.asyncLoadingError);
        } else {
          const component = this.showComponent(LoadingErrorComponent);
          component.instance.errorMessage = this.asyncLoadingError;
        }
      });
  }

  private valueReceived(value) {
    if (this.asyncLoadingEmpty &&
      (!value || ((length in value || Array.isArray(value)) && value.length === 0))) {
        if (this.asyncLoadingEmpty instanceof TemplateRef || this.asyncLoadingEmpty instanceof Type) {
          this.showComponentOrTemplate(this.asyncLoadingEmpty);
        } else {
          const component = this.showComponent(LoadingEmptyComponent);
          component.instance.emptyMessage = this.asyncLoadingEmpty;
        }
      } else this.showTemplate(this.templateRef);

  }

  private showComponentOrTemplate(toShow: TemplateRef<any> | Type<any>) {
    if (toShow instanceof TemplateRef) this.showTemplate(toShow);
    else this.showComponent(toShow);
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

  constructor(private elementRef: ElementRef, private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) { }

}
