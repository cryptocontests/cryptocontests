import { Component, OnInit, Input } from '@angular/core';
import { FilterComponent } from '../filter.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'filter-autocomplete',
  templateUrl: './filter-autocomplete.component.html',
  styleUrls: [
    './filter-autocomplete.component.css',
    '../filter-toolbar/filter-toolbar.component.css'
  ]
})
export class FilterAutocompleteComponent extends FilterComponent {
  @Input() autocompleteValues: string[] = [];
  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }
}
