import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[web3TransactionLauncher]'
})
export class Web3TransactionLauncherDirective {
  constructor(private elementRef: ElementRef, private overlay: Overlay) {}

  @HostListener('click')
  launchPanel() {
    const overlayConfig: OverlayConfig = new OverlayConfig({
      hasBackdrop: false
    });
    overlayConfig.positionStrategy = this.overlay.position().connectedTo(
      this.elementRef,
      {
        originX: 'start',
        originY: 'bottom'
      },
      {
        overlayX: 'start',
        overlayY: 'top'
      }
    );
    overlayConfig.scrollStrategy = this.overlay.scrollStrategies.reposition();

    const overlayRef = this.overlay.create(overlayConfig);
    const transactionListComponent = new ComponentPortal(
      TransactionListComponent
    );

    overlayRef.attach(transactionListComponent);
    console.log('hiii');

    overlayRef.backdropClick().subscribe(() => overlayRef.detach());
  }
}
