import { Component, ContentChild, ContentChildren, QueryList,
  ViewContainerRef, ViewChild, ViewEncapsulation, ChangeDetectionStrategy,
  TemplateRef, AfterViewInit, ChangeDetectorRef, OnChanges, Input, Output, EventEmitter
} from '@angular/core';
import { TemplatePortal, CdkPortal } from '@angular/cdk/portal';
import { ListKeyManager } from '@angular/cdk/a11y';
import { GalleryPageComponent } from '../gallery-page/gallery-page.component';
import { GalleryToolbarComponent } from '../gallery-toolbar/gallery-toolbar.component';
import { GalleryPagePortalComponent } from '../gallery-page-portal/gallery-page-portal.component';

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GalleryComponent implements OnChanges, AfterViewInit {

  // Whether the gallery will connect its start and end pages to
  // allow navigation between them
  @Input('wrap-pages')
  wrapPages: boolean = false;

  // Whether the gallery will allow LEFT and RIGHT keys
  // navigations between items
  @Input('keyboard-navigation')
  keyboardNavigation: boolean = true;

  // Whether the indicators are clickable to navigate to the items
  @Input('indicator-navigation')
  indicatorNavigation: boolean = true;

  // Number of indicators that will be displayed at the same time
  @Input('max-indicators')
  maxIndicators: number = 6;

  // Whether the state of the selected page should be maintained
  // if the component visibility changes
  @Input('maintain-state')
  maintainSelected: boolean = true;

  // Material icon to go to left page
  @Input('left-arrow-icon')
  leftArrowIcon: string = 'arrow_back';

  // Material icon to go to left page
  @Input('right-arrow-icon')
  rightArrowIcon: string = 'arrow_forward';

  // Emits an event with every selection of page
  @Output('select-page')
  selectPageEmitter = new EventEmitter<number>();

  selectedPage: number = 0;

  // Transclude the elements inside the <gallery> component where appropriate

  toolbarPortal: TemplatePortal;
  pagesPortal: TemplatePortal;

  @ContentChild(GalleryToolbarComponent)
  toolbar: GalleryToolbarComponent;
  @ContentChildren(GalleryPageComponent)
  pages: QueryList<GalleryPageComponent>;

  @ContentChild('indicator')
  customIndicator: TemplateRef<any>;
  @ViewChild('defaultIndicator')
  defaultIndicator: TemplateRef<any>;

  private keyManager: ListKeyManager<GalleryPageComponent>;

  constructor(private changeDetectionRef: ChangeDetectorRef, private viewContainerRef: ViewContainerRef) { }

  /**
   * @return the index of the current selected page
   */
  public getSelectedPage(): number {
    return this.selectedPage;
  }

  // Only here the pages property has been populated
  ngAfterViewInit() {
    this.keyManager = new ListKeyManager<GalleryPageComponent>(this.pages.toArray())
      .withHorizontalOrientation('ltr')
      .withVerticalOrientation(false);

    if (this.wrapPages) this.keyManager = this.keyManager.withWrap();

    this.keyManager.change.subscribe(selectedIndex => {

      if (selectedIndex !== this.selectedPage) {
        this.pages.toArray().forEach((page: GalleryPageComponent, index: number) => {
          page.position = index - selectedIndex;

          // If there is already a selected tab, then set up an origin for the next selected tab
          // if it doesn't have one already.
          if (selectedIndex != null && page.position == 0 && !page.origin) {
            page.origin = selectedIndex - this.selectedPage;
          }
        })

      }
      this.pagesPortal = this.pages.toArray()[selectedIndex].content;

      this.selectedPage = selectedIndex;
      this.selectPageEmitter.emit(selectedIndex);
    });

    this.selectPage(this.selectedPage);

    if (this.toolbar) this.toolbarPortal = this.toolbar.content;

    // Tell angular about the changes in the class
    this.changeDetectionRef.detectChanges();
  }

  //  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.keyboardNavigation) this.keyManager.onKeydown(event);
  }

  selectPage(value: number) {
    this.keyManager.setActiveItem(value);
  }

  indicatorClick(value: number) {
    if (this.indicatorNavigation) this.selectPage(value);
  }

  ngOnChanges() {
    if (this.maintainSelected) this.selectPage(this.selectedPage);
  }

  selectLeftPage() {
    if (this.selectedPage > 0) this.selectPage(this.selectedPage - 1);
    else if (this.wrapPages) this.selectPage(this.pages.length - 1);
  }

  selectRightPage() {
    if (this.selectedPage < this.pages.length - 1) this.selectPage(this.selectedPage + 1);
    else if (this.wrapPages) this.selectPage(0);
  }

  canGoRight(): boolean {
    return this.wrapPages || this.selectedPage < this.pages.length - 1;
  }

  canGoLeft(): boolean {
    return this.wrapPages || this.selectedPage > 0;
  }

  /**
   * If a custom indicator template was provided, populated
   * with context, otherwise use the default template
   */
  createPortal(index: number): TemplatePortal {
    const context = {
      index: index,
      selected: index === this.selectedPage
    };

    return new TemplatePortal(this.customIndicator ? this.customIndicator : this.defaultIndicator, this.viewContainerRef, context);
  }

  // Indicator pages controls

  getIndicatorPage(): number {
    return Math.floor(this.selectedPage / this.maxIndicators);
  }

  getOffset(): number {
    return this.getIndicatorPage() * this.maxIndicators;
  }

  indicatorFirstPage(): boolean {
    return this.selectedPage < this.maxIndicators;
  }

  indicatorLastPage(): boolean {
    return this.getTotalPages() === this.getIndicatorPage();
  }

  getTotalPages(): number {
    return Math.floor(this.pages.length / this.maxIndicators);
  }

}
