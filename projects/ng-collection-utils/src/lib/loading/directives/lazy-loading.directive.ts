import {
  Directive,
  HostListener,
  Input,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  Type,
  Output,
  EventEmitter,
  ComponentRef,
  OnInit
} from '@angular/core';
import { BaseLoading } from './base-loading';
import { Observable } from 'rxjs';
import { LoadingComponent } from '../components/loading/loading.component';

@Directive({
  selector: '[lazyLoading]'
})
export class LazyLoadingDirective extends BaseLoading {
  @Input('lazyLoading')
  set lazyLoading(obs: Observable<any>) {
    this.bindObservable(obs);
  }
  @Input() lazyLoadingError: TemplateRef<any> | Type<any> | string;
  @Input() lazyLoadingEmpty: TemplateRef<any> | Type<any> | string;
  @Output() fetchElements = new EventEmitter<[number, number]>();

  @Input() bottomOffset = 100;
  @Input() elementsToFetch = 30;
  elementCount = 0;

  loadingSpinner: ComponentRef<any>;

  constructor(
    protected elementRef: ElementRef,
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(elementRef, templateRef, viewContainer, componentFactoryResolver);
  }

  getCustomEmpty() {
    return this.lazyLoadingEmpty;
  }

  getCustomError() {
    return this.lazyLoadingError;
  }

  @HostListener('scroll', ['$event'])
  public scrolled($event: Event) {
    const target = <HTMLElement>$event.target;
    const scrollPosition = target.scrollHeight - target.scrollTop;
    const offsetHeight = target.offsetHeight;
    const isReachingBottom = scrollPosition - offsetHeight < this.bottomOffset;
    if (!this.loading && isReachingBottom) this.requestElements();
  }

  private requestElements() {
    this.loading = true;
    this.loadingSpinner = this.addComponent(LoadingComponent);
    this.fetchElements.emit([
      this.elementCount,
      this.elementCount + this.elementsToFetch
    ]);
    this.elementCount += this.elementsToFetch;
  }

  protected showComponent(component: Type<any>): ComponentRef<any> {
    this.loadingSpinner.destroy();
    return this.addComponent(component);
  }

  protected showTemplate(templateRef: TemplateRef<any>) {
    this.loadingSpinner.destroy();
    this.viewContainer.createEmbeddedView(templateRef);
  }
}
