import {
  Directive,
  Input,
  ElementRef,
  ViewContainerRef,
  HostListener
} from '@angular/core';
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  OverlayKeyboardDispatcher
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { GalleryTemplate } from './gallery-template/gallery-template.component';
import { ESCAPE } from '@angular/cdk/keycodes';

@Directive({
  selector: '[galleryLauncher]',
  host: {
    '(click)': 'createOverlay($event)'
  }
})
export class GalleryLauncherDirective {
  @Input('galleryLauncher')
  galleryTemplate: GalleryTemplate;

  overlayRef: OverlayRef;

  constructor(
    public overlay: Overlay,
    private overlayDispatcher: OverlayKeyboardDispatcher,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {}

  createOverlay() {
    setTimeout(() => {
      // Set the gallery to fill all the width in the overlay
      this.galleryTemplate.gallery.viewContainerRef.element.nativeElement.attributes.style.nodeValue +=
        'width: 100%; height: 100%;';

      let config = new OverlayConfig();
      config.hasBackdrop = true;
      config.positionStrategy = this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
        .width('100%')
        .height('100%');

      this.overlayRef = this.overlay.create(config);

      const portal = new TemplatePortal(
        this.galleryTemplate.template,
        this.viewContainerRef
      );
      this.overlayRef.backdropClick().subscribe(() => {
        this.overlayRef.dispose();
      });

      this.overlayRef.attach(portal);
      this.overlayDispatcher.add(this.overlayRef);

      this.galleryTemplate.close.subscribe(() => {
        this.overlayRef.dispose();
        this.overlayDispatcher.remove(this.overlayRef);
      });
    });
  }

  @HostListener('document:keydown', ['$event'])
  private handleKeydown(event: KeyboardEvent) {
    this.galleryTemplate.gallery.onKeyDown(event);
    if (this.overlayRef) {
      if (event.keyCode === ESCAPE) {
        this.overlayRef.dispose();
      }
    }
  }
}
