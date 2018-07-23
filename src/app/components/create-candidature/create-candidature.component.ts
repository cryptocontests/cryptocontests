import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilePickerComponent } from '../file-picker/file-picker.component';
import { Candidature } from '../../state/contest.model';

@Component({
  selector: 'cc-create-candidature',
  templateUrl: './create-candidature.component.html',
  styleUrls: ['./create-candidature.component.css']
})
export class CreateCandidatureComponent {
  candidatureForm: FormGroup;
  @ViewChild('filePicker') filePicker: FilePickerComponent;

  constructor(
    public dialogRef: MatDialogRef<CreateCandidatureComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.candidatureForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  cancel($event) {
    this.dialogRef.close();
  }

  createCandidature() {
    const candidature: Candidature = {
      title: this.candidatureForm.value.title,
      creator: null,
      date: null,
      content: {
        hash: null,
        content: new Buffer(this.filePicker.file.content)
      },
      votes: 0,
      cancelled: false
    };
    this.dialogRef.close(candidature);
  }
}
