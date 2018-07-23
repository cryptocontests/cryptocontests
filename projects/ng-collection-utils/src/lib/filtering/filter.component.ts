import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  template: ''
})
export class FilterComponent implements OnInit {
  @Input() title: string;
  @Input() name: string;
  @Output() valueChanges = new EventEmitter<any>();

  formGroup: FormGroup;
  // Optional value for in-control behaviour
  value: any;

  constructor(protected formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.buildFormControl();
    this.formGroup.valueChanges.pipe(tap(this.valueChanges.emit));
  }

  /**
   * Build the form for this particular filter component
   */
  protected buildFormControl(): FormGroup {
    return this.formBuilder.group({ [this.name]: '' });
  }
}
