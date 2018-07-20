import { Directive, ElementRef, HostListener, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Portal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';

export abstract class OverlayMenu {
  subscription: Subscription;
  constructor(protected elementRef: ElementRef, protected overlay: Overlay) {}

  abstract createPortal(): Portal<any>;

  protected instantiateComponent(overlayRef: OverlayRef): ComponentRef<any> {
    return overlayRef.attach(this.createPortal());
  }

  @HostListener('click')
  launchPanel(): ComponentRef<any> {
    const overlayConfig: OverlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backgorund'
    });
    overlayConfig.positionStrategy = this.overlay.position().connectedTo(
      this.elementRef,
      {
        originX: 'end',
        originY: 'bottom'
      },
      {
        overlayX: 'end',
        overlayY: 'top'
      }
    );
    overlayConfig.scrollStrategy = this.overlay.scrollStrategies.reposition();

    const overlayRef = this.overlay.create(overlayConfig);

    const componentRef = this.instantiateComponent(overlayRef);

    this.subscription = overlayRef.backdropClick().subscribe(() => {
      overlayRef.dispose();
      this.subscription.unsubscribe();
    });

    return componentRef;
  }
}
