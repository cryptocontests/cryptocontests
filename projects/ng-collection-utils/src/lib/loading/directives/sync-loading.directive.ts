import {
  Directive,
  Input,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { TemplateInput, BaseLoading } from './base-loading';

@Directive({
  selector: '[syncLoading]'
})
export class SyncLoadingDirective extends BaseLoading {
  @Input('syncLoading')
  set syncLoading(value: any) {
    this.showValue(value);
  }
  @Input() syncLoadingError: TemplateInput;
  @Input() syncLoadingEmpty: TemplateInput;

  constructor(
    protected elementRef: ElementRef,
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(elementRef, templateRef, viewContainer, componentFactoryResolver);
  }

  getCustomEmpty() {
    return this.syncLoadingEmpty;
  }

  getCustomError() {
    return this.syncLoadingError;
  }
}
