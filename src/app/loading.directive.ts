import { Directive, Input, ElementRef, OnInit, TemplateRef, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { LoadingComponent } from './components/loading/loading.component';
import { Observable } from 'rxjs';

@Directive({
  selector: '[ngLoading]'
})
export class LoadingDirective {

  @Input() ngLoadingError: TemplateRef<any> | Type<any>;
  @Input() ngLoadingEmpty: TemplateRef<any> | Type<any>;

  @Input('ngLoading') set ngLoading(showLoadingSpinner: boolean | Observable<any>) {
    if (showLoadingSpinner instanceof Observable) this.bindObservable(showLoadingSpinner);
    else if (showLoadingSpinner) this.showComponent(LoadingComponent);
    else this.showTemplate(this.templateRef);
  }

  bindObservable(observable: Observable<any>) {
    this.showComponent(LoadingComponent);
    observable.subscribe((value) => {
      if (this.ngLoadingEmpty &&
        (!value || ((length in value || Array.isArray(value)) && value.length === 0))) {
        this.showComponentOrTemplate(this.ngLoadingEmpty);
      } else this.showTemplate(this.templateRef);
    }, (error) => this.showComponentOrTemplate(this.ngLoadingError));
  }

  private showComponentOrTemplate(toShow: TemplateRef<any> | Type<any>) {
    if (toShow instanceof TemplateRef) this.showTemplate(toShow);
    else this.showComponent(toShow);
  }

  private showComponent(component: Type<any>) {
    this.viewContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.viewContainer.createComponent(componentFactory);
  }

  private showTemplate(templateRef: TemplateRef<any>) {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(templateRef);
  }

  constructor(private elementRef: ElementRef, private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) { }

}
