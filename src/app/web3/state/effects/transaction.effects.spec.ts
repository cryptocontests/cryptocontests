import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { TransactionEffects } from './transaction.effects';

describe('TransactionService', () => {
  let actions$: Observable<any>;
  let effects: TransactionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(TransactionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
