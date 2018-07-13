import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../filter.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'lib-filter-multioption',
  templateUrl: './filter-multioption.component.html',
  styleUrls: ['./filter-multioption.component.css']
})
export class FilterMultioptionComponent extends FilterComponent
  implements OnInit {
  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  ngOnInit() {}
}
