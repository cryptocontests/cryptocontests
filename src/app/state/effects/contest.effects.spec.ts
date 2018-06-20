import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ContestEffects } from './contest.effects';

describe('AppService', () => {
  let actions$: Observable<any>;
  let effects: AppEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContestEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.get(ContestEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
