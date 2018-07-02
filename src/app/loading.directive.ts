import { Directive, Input, ElementRef, OnInit, TemplateRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { LoadingComponent } from './components/loading/loading.component';

@Directive({
  selector: '[loading]'
})
export class LoadingDirective implements OnInit {

  @Input('loading') set loading(showLoadingSpinner: boolean) {
    if (showLoadingSpinner) {
      this.viewContainer.clear();
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LoadingComponent);
      this.viewContainer.createComponent(componentFactory);
    } else {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(private elementRef: ElementRef, private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() { }

}
