import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FilterComponent } from '../filter.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChipsAutocompleteComponent } from '../../components';

@Component({
  selector: 'filter-autocomplete',
  templateUrl: './filter-autocomplete.component.html',
  styleUrls: [
    './filter-autocomplete.component.css',
    '../filter-toolbar/filter-toolbar.component.css'
  ]
})
export class FilterAutocompleteComponent extends FilterComponent {
  @Input()
  autocompleteValues: string[] = [];

  @ViewChild(ChipsAutocompleteComponent)
  chipsAutocomplete: ChipsAutocompleteComponent;

  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  /**
   * Build the form for this particular filter component
   */
  protected buildFormControl(): FormGroup {
    return this.chipsAutocomplete.formGroup;
  }
}
