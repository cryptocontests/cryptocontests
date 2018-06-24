import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationsGridComponent } from './participations-grid.component';

describe('ParticipationsGridComponent', () => {
  let component: ParticipationsGridComponent;
  let fixture: ComponentFixture<ParticipationsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipationsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
