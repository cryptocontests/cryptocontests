import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent
} from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'chips-autocomplete',
  templateUrl: './chips-autocomplete.component.html',
  styleUrls: [
    './chips-autocomplete.component.css',
    '../../filtering/filter-toolbar/filter-toolbar.component.css'
  ]
})
export class ChipsAutocompleteComponent implements OnInit {
  @Input()
  autocompleteValues = [];
  @Input()
  placeholder = 'List';
  @Input()
  controlName: string;
  @ViewChild('textInput')
  textInput: ElementRef;
  @Input()
  separatorKeysCodes = [ENTER, COMMA];
  @Input()
  floatLabel = 'always';

  @Input()
  chips: string[] = [];
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({ [this.controlName]: '' });
    this.formGroup.patchValue({ tags: this.chips });
  }

  /** Management of the tags component **/

  add(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.chips.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    //    this.contestForm.value.tags = null;
    this.formGroup.patchValue({ tags: this.chips });
  }

  remove(chip: string) {
    const index = this.chips.indexOf(chip);
    if (index >= 0) this.chips.splice(index, 1);
    this.formGroup.patchValue({ tags: this.chips });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.chips.push(event.option.viewValue);
    this.textInput.nativeElement.value = '';
    // this.contestForm.value.tags = null;
    this.formGroup.patchValue({ tags: this.chips });
  }
}
