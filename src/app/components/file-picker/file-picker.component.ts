import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output
} from '@angular/core';
import {
  ReadMode,
  ReadFile,
  FilePickerDirective
} from 'ngx-file-helpers';

@Component({
  selector: 'cc-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.css']
})
export class FilePickerComponent implements OnInit {
  public readMode = ReadMode.dataURL;

  @Input() multiple = false;

  file: ReadFile;
  dragging = false;

  @ViewChild(FilePickerDirective) private filePicker;

  constructor() {}

  ngOnInit() {}

  public getFile() {
    return this.file;
  }

  fileRead(file: ReadFile) {
    // if (!this.multiple && this.files.length > 0) this.files.splice(0, 1);
    this.file = file;
  }

  removeFile() {
    this.file = undefined;
    this.filePicker.reset();
  }

  onReadEnd(fileCount: number) {}
}
