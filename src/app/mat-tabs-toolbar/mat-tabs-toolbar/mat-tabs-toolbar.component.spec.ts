import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTabsToolbarComponent } from './mat-tabs-toolbar.component';

describe('MatTabsToolbarComponent', () => {
  let component: MatTabsToolbarComponent;
  let fixture: ComponentFixture<MatTabsToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatTabsToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTabsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
