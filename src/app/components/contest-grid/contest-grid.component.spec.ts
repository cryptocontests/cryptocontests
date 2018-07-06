import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestGridComponent } from './contest-grid.component';

describe('ContestGridComponent', () => {
  let component: ContestGridComponent;
  let fixture: ComponentFixture<ContestGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
