import {
  Directive,
  OnInit,
  ElementRef,
  ComponentRef,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Portal, TemplatePortal, ComponentPortal } from '@angular/cdk/portal';
import { OverlayMenu } from './overlay.menu';
import { OverlayCardComponent } from './components/overlay-card/overlay-card.component';

@Directive({
  selector: '[overlayTrigger]'
})
export class OverlayTriggerDirective extends OverlayMenu implements OnInit {
  @Input() overlayTrigger: TemplateRef<any>;
  @Input() card = true;

  templatePortal: TemplatePortal;

  constructor(
    protected elementRef: ElementRef,
    protected overlay: Overlay,
    protected viewContainerRef: ViewContainerRef
  ) {
    super(elementRef, overlay);
  }

  ngOnInit() {
    this.templatePortal = new TemplatePortal(
      this.overlayTrigger,
      this.viewContainerRef
    );
  }

  protected instantiateComponent(overlayRef: OverlayRef): ComponentRef<any> {
    const componentRef: ComponentRef<any> = super.instantiateComponent(
      overlayRef
    );
    componentRef.instance.content = this.templatePortal;
    return componentRef;
  }

  createPortal(): Portal<any> {
    if (!this.card) return this.templatePortal;
    else return new ComponentPortal(OverlayCardComponent);
  }
}
