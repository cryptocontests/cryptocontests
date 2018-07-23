import { Component } from '@angular/core';
import { FilterComponent } from './filter.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  template: ''
})
export class FilterGroupComponent extends FilterComponent {
  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  getFormProperties() {
    return {};
  }

  protected buildFormControl(): FormGroup {
    return this.formBuilder.group(this.getFormProperties());
  }
}
