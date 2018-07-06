import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateParticipationComponent } from './create-participation.component';

describe('CreateParticipationComponent', () => {
  let component: CreateParticipationComponent;
  let fixture: ComponentFixture<CreateParticipationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateParticipationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
