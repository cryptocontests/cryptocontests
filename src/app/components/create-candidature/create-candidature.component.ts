import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilePickerComponent } from '../file-picker/file-picker.component';
import { Candidature, Contest } from '../../state/contest.model';
import { sha256, sha224 } from 'js-sha256';
import { ReadFile } from 'ngx-file-helpers';

@Component({
  selector: 'cc-create-candidature',
  templateUrl: './create-candidature.component.html',
  styleUrls: ['./create-candidature.component.css']
})
export class CreateCandidatureComponent {
  candidatureForm: FormGroup;
  @ViewChild('filePicker')
  filePicker: FilePickerComponent;
  upload = false;

  constructor(
    public dialogRef: MatDialogRef<CreateCandidatureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: boolean,
    private formBuilder: FormBuilder
  ) {
    if (!data) this.buildForm();
    this.upload = data;
  }

  private buildForm() {
    this.candidatureForm = this.formBuilder.group({
      title: ['', Validators.required],
      contentHash: ['', Validators.required]
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
        hash: '0x' + this.candidatureForm.value.contentHash
      },
      votes: 0,
      cancelled: false
    };
    this.dialogRef.close(candidature);
  }

  hashEnabled(): boolean {
    return this.filePicker.file && this.filePicker.file.content;
  }

  fileRead(file: ReadFile) {
    const hash = sha256(file.content);
    this.candidatureForm.patchValue({ contentHash: hash });
  }
}
