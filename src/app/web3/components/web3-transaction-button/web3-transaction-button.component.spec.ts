import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Web3TransactionButtonComponent } from './web3-transaction-button.component';

describe('Web3TransactionButtonComponent', () => {
  let component: Web3TransactionButtonComponent;
  let fixture: ComponentFixture<Web3TransactionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Web3TransactionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Web3TransactionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
