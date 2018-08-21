import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { OverlayModule, OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { A11yModule } from '@angular/cdk/a11y';
import { MatIconModule, MatButtonModule } from '@angular/material';

import { GalleryComponent } from './gallery/gallery.component';
import { GalleryPageComponent } from './gallery-page/gallery-page.component';
import { GalleryLauncherDirective } from './gallery-launcher.directive';
import { GalleryTemplate } from './gallery-template/gallery-template.component';
import { GalleryToolbarComponent } from './gallery-toolbar/gallery-toolbar.component';
import { GalleryPagePortalComponent } from './gallery-page-portal/gallery-page-portal.component';
import { GalleryPageBodyComponent } from './gallery-page-body/gallery-page-body.component';

@NgModule({
  imports: [
    MatIconModule, MatButtonModule, FlexLayoutModule, CommonModule, OverlayModule, PortalModule, A11yModule
  ],
  entryComponents: [GalleryComponent, GalleryPageComponent],
  declarations: [GalleryComponent, GalleryPageComponent, GalleryLauncherDirective, GalleryTemplate, GalleryToolbarComponent, GalleryPagePortalComponent, GalleryPageBodyComponent],
  exports: [GalleryComponent, GalleryPageComponent, GalleryTemplate, GalleryLauncherDirective, GalleryToolbarComponent]
})
export class GenericGalleryModule { }
