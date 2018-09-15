import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { Store } from '@ngrx/store';
import { State, selectTags } from '../../state/contest.reducer';
import { Contest } from '../../state/contest.model';
import { CreateContest } from '../../state/contest.actions';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent,
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { CryptoCurrency } from 'ng-web3';
import { FilePickerComponent } from '../file-picker/file-picker.component';
import { of, Observable } from 'rxjs';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'cc-create-contest',
  templateUrl: './create-contest.component.html',
  styleUrls: ['./create-contest.component.css']
})
export class CreateContestComponent implements OnInit {
  contestForm: FormGroup;
  allTags$: Observable<string[]>;
  tags: string[] = [];
  separatorKeysCodes = [ENTER, COMMA];

  @ViewChild('tagInput')
  tagInput: ElementRef;
  @ViewChild('filePicker')
  filePicker: FilePickerComponent;

  constructor(
    private store: Store<State>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.allTags$ = this.store.select(selectTags);
  }

  greaterThanDate(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!this.contestForm || !control) return null;
      const fieldToCompare = this.contestForm.value[field];
      if (!fieldToCompare) return null;
      const isLessThan =
        Number(fieldToCompare.valueOf()) > Number(control.value.valueOf());
      return isLessThan ? { lessThan: { value: control.value } } : null;
    };
  }

  lessThan(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!this.contestForm || !control) return null;
      const fieldToCompare = this.contestForm.value[field];
      if (!fieldToCompare) return null;
      const isLessThan = Number(fieldToCompare) < Number(control.value);
      return isLessThan ? { lessThan: { value: control.value } } : null;
    };
  }

  futureDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return control.value.valueOf() <= Date.now()
        ? { futureDate: { value: control.value } }
        : null;
    };
  }

  private buildForm() {
    this.contestForm = this.formBuilder.group({
      title: ['', Validators.required],
      judgeName: ['', Validators.required],
      judgeAddress: ['', Validators.required],
      judgeWeight: [1, Validators.required],
      description: '',
      award: ['', Validators.required],
      candidaturesStake: ['', [Validators.required, this.lessThan('award')]],
      initialDate: ['', [Validators.required, this.futureDate()]],
      candidatureLimitDate: [
        '',
        [Validators.required, this.greaterThanDate('initialDate')]
      ],
      endDate: [
        '',
        [Validators.required, this.greaterThanDate('candidatureLimitDate')]
      ],
      tags: ''
    });
  }

  /**
   * Management of the tags component
   */

  add(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

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
    if (this.tags.length < 5) {
      const contest: Partial<Contest> = {
        judges: [
          {
            name: this.contestForm.value.judgeName,
            weight: this.contestForm.value.judgeWeight,
            address: this.contestForm.value.judgeAddress
          }
        ],
        title: this.contestForm.value.title,
        additionalContent: {
          hash: null,
          content: {
            description: this.contestForm.value.description,
            image: new Buffer(this.filePicker.getFile().content)
          }
        },
        award: {
          value: this.contestForm.value.award,
          currency: CryptoCurrency.ETH
        },
        candidaturesStake: {
          value: this.contestForm.value.candidaturesStake,
          currency: CryptoCurrency.ETH
        },
        initialDate: this.contestForm.value.initialDate.valueOf(),
        candidatureLimitDate: this.contestForm.value.candidatureLimitDate.valueOf(),
        endDate: this.contestForm.value.endDate.valueOf(),
        tags: this.tags
      };
      this.store.dispatch(new CreateContest(contest));
    } else {
      this.snackBar.open(
        'Only 4 or less tags are allowed for the contest',
        null,
        {
          duration: 3000
        }
      );
    }
  }
}
