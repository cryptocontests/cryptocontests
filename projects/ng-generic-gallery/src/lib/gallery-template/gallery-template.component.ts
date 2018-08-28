import {
  Component,
  ContentChild,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  Input,
  AfterViewInit
} from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
  selector: 'gallery-template',
  templateUrl: './gallery-template.component.html',
  styleUrls: ['./gallery-template.component.css']
})
export class GalleryTemplate implements AfterViewInit {
  // Material icon to close the gallery overlay
  @Input()
  closeIcon = 'close';

  // Possible values: 'start', 'end', 'none'
  @Input('close-position')
  closePosition = 'start';

  @Output()
  public close = new EventEmitter<void>();

  @ViewChild('overlayTemplate')
  public template: TemplateRef<any>;
  @ContentChild(GalleryComponent)
  public gallery: GalleryComponent;

  @ContentChild('closeButton')
  customCloseButton: TemplateRef<any>;
  @ViewChild('defaultCloseButton')
  closeButton: TemplateRef<any>;

  ngAfterViewInit() {
    if (this.customCloseButton) {
      this.closeButton = this.customCloseButton;
    }
  }

  closeOverlay() {
    this.close.emit();
  }
}
