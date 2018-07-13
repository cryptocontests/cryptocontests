import { Directive, ElementRef, HostListener } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Portal } from '@angular/cdk/portal';

export abstract class OverlayMenu {
  constructor(protected elementRef: ElementRef, protected overlay: Overlay) {}

  abstract createPortal(): Portal<any>;

  @HostListener('click')
  launchPanel() {
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

    overlayRef.attach(this.createPortal());

    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
  }
}
