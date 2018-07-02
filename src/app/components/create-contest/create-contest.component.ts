import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { Store } from '@ngrx/store';
import { State } from '../../state/reducers/contest.reducer';
import { Contest } from '../../state/contest.model';
import { CreateContest } from '../../state/actions/contest.actions';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent,
  MatDialog
} from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'cc-create-contest',
  templateUrl: './create-contest.component.html',
  styleUrls: ['./create-contest.component.css']
})
export class CreateContestComponent {

  contestForm: FormGroup;
  tags: string[] = [];
  separatorKeysCodes = [ENTER, COMMA];

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(
    private store: Store<State>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.contestForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: '',
      prize: ['', Validators.required],
      initialDate: ['', Validators.required],
      participationLimitDate: ['', Validators.required],
      endDate: ['', Validators.required],
      tags: ''
    });
  }

  /**
   * Management of the tags component
   */

  add(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    console.log(this.contestForm.value.tags);
    this.contestForm.value.tags = null;
  }

  remove(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) this.tags.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.contestForm.value.tags = null;
  }

  /**
   * Cancel contest: confirm cancellation
   */
  cancel(event) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Cancel new contest'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.router.navigate(['/contests']);
    });
  }

  createContest() {
    const contest: Contest = {
      id: null,
      title: this.contestForm.value.title,
      description: this.contestForm.value.description,
      prize: this.contestForm.value.prize,
      createdDate: null,
      initialDate: this.contestForm.value.initialDate.valueOf(),
      participationLimitDate: this.contestForm.value.participationLimitDate.valueOf(),
      endDate: this.contestForm.value.endDate.valueOf(),
      tags: this.tags
    };
    this.store.dispatch(new CreateContest(contest));
  }
}
