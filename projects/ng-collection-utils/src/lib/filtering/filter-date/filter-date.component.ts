import { Component, OnInit } from '@angular/core';
import { FilterGroupComponent } from '../filter-group.component';
import { FormBuilder } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'filter-date',
  templateUrl: './filter-date.component.html',
  styleUrls: [
    './filter-date.component.css',
    '../filter-toolbar/filter-toolbar.component.css'
  ]
})
export class FilterDateComponent extends FilterGroupComponent {
  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  getFormProperties() {
    return {
      afterDate: '',
      beforeDate: ''
    };
  }
}
