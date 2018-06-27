import { Injectable } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { LoadingComponent } from '../components/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalLoadingService {
  overlayRef: OverlayRef;
  overlayConfig: OverlayConfig;

  constructor(private overlay: Overlay) {
    this.overlayConfig = new OverlayConfig({
      hasBackdrop: true
    });
    this.overlayConfig.positionStrategy = overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
  }

  public show() {
    this.overlayRef = this.overlay.create(this.overlayConfig);
    const component = new ComponentPortal(LoadingComponent);
    this.overlayRef.attach(component);
  }

  public hide() {
    this.overlayRef.dispose();
  }
}
