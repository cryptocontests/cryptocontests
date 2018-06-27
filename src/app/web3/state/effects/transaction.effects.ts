import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import {
  TransactionActions,
  TransactionActionTypes
} from '../actions/transaction.actions';
import { exhaustMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class TransactionEffects {
  /*
  @Effect()
  sendTransaction$: Observable<Action> = this.actions$
    .ofType(TransactionActionTypes.SendTransaction)
    .pipe(exhaustMap((action: SendTransaction)=>)); */
  constructor(private actions$: Actions) {}
}
