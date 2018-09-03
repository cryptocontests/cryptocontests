import { TransactionListComponent } from './web3-transaction-list/web3-transaction-list.component';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Store } from '@ngrx/store';
import { TransactionStateService } from '../services/transaction-state.service';

@Directive({
  selector: '[web3TransactionLauncher]'
})
export class Web3TransactionLauncherDirective {
  constructor(
    private elementRef: ElementRef,
    private overlay: Overlay,
    private transactionState: TransactionStateService
  ) {}

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
    const transactionListComponent = new ComponentPortal(
      TransactionListComponent
    );

    overlayRef.attach(transactionListComponent);

    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

    this.transactionState.markTransactionsSeen();
  }
}
