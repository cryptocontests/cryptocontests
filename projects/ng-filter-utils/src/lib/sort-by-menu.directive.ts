import {
  Input,
  Directive,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
  Injector,
  InjectionToken
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import {
  ComponentPortal,
  TemplatePortal,
  PortalInjector,
  Portal
} from '@angular/cdk/portal';
import { OverlayMenu } from './overlay.menu';
import { SortByComponent } from './sort-by/sort-by.component';

export const SORTING_OPTIONS = new InjectionToken<any>('SORTING_OPTIONS');

@Directive({
  selector: '[sortByMenu]'
})
export class SortByMenuDirective extends OverlayMenu {
  @Input() sortByMenu: string[] = [];
  @Input() sortByTitle = 'Sort by';
  @Output() sortByOptionSelected = new EventEmitter<string>();

  constructor(
    protected elementRef: ElementRef,
    protected overlay: Overlay,
    protected injector: Injector
  ) {
    super(elementRef, overlay);
  }

  createPortal(): Portal<any> {
    return new ComponentPortal(SortByComponent, null, this.createInjector());
  }

  private createInjector(): PortalInjector {
    // Instantiate new WeakMap for our custom injection tokens
    const injectionTokens = new WeakMap();

    // Set custom injection tokens
    injectionTokens.set(SORTING_OPTIONS, {
      options: this.sortByMenu,
      title: this.sortByTitle,
      eventEmitter: this.sortByOptionSelected
    });

    // Instantiate new PortalInjector
    return new PortalInjector(this.injector, injectionTokens);
  }
}
