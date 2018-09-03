import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Judge } from '../../state/contest.model';

@Component({
  selector: 'cc-add-judge',
  templateUrl: './add-judge.component.html',
  styleUrls: ['./add-judge.component.css']
})
export class AddJudgeComponent implements OnInit {
  judgeForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddJudgeComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.judgeForm = this.formBuilder.group({
      name: ['', Validators.required],
      weight: ['1', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {}

  cancel($event) {
    this.dialogRef.close();
  }

  addJudge() {
    if (this.judgeForm.valid) {
      const judge: Judge = {
        address: this.judgeForm.value.address,
        weight: this.judgeForm.value.weight,
        name: this.judgeForm.value.name
      };
      this.dialogRef.close(judge);
    }
  }
}
