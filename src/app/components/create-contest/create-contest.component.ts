import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
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
import { State, selectTags } from '../../state/reducers/contest.reducer';
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
import { CryptoCurrency } from '../../web3/transaction.model';
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

  @ViewChild('tagInput') tagInput: ElementRef;
  @ViewChild('filePicker') filePicker: FilePickerComponent;

  constructor(
    private store: Store<State>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.allTags$ = this.store.select(selectTags);
  }

  private buildForm() {
    this.contestForm = this.formBuilder.group({
      title: ['', Validators.required],
      judgeName: ['', Validators.required],
      judgeAddress: ['', Validators.required],
      description: '',
      prize: ['', Validators.required],
      candidatureTax: ['', Validators.required],
      initialDate: ['', Validators.required],
      candidatureLimitDate: ['', Validators.required],
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
    const contest: Contest = {
      id: null,
      judges: [
        {
          name: this.contestForm.value.judgeName,
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
      prize: {
        value: this.contestForm.value.prize,
        currency: CryptoCurrency.ETH
      },
      taxForCandidature: {
        value: this.contestForm.value.candidatureTax,
        currency: CryptoCurrency.ETH
      },
      createdDate: null,
      initialDate: this.contestForm.value.initialDate.valueOf(),
      candidatureLimitDate: this.contestForm.value.candidatureLimitDate.valueOf(),
      endDate: this.contestForm.value.endDate.valueOf(),
      tags: this.tags,
      options: {}
    };
    this.store.dispatch(new CreateContest(contest));
  }
}
