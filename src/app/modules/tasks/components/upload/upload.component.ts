import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TasksStore } from '../../store/tasks.store';

@Component({
  selector: 'app-upload',
  imports: [],
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  private readonly router = inject(Router);
  readonly tasksStore = inject(TasksStore);

  readonly isUploading = signal(false);
  readonly uploadError = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly dragOver = signal(false);

  readonly acceptedFileTypes = '.pdf,.doc,.docx,.txt';
  readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);
  }

  validateAndSetFile(file: File): void {
    this.uploadError.set(null);

    // Check file size
    if (file.size > this.maxFileSize) {
      this.uploadError.set('File size exceeds 10MB limit');
      return;
    }

    // Check file type
    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      this.uploadError.set('Only PDF, Word (.doc, .docx), and Text (.txt) files are allowed');
      return;
    }

    this.selectedFile.set(file);
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.uploadError.set(null);
  }

  uploadAndExtract(): void {
    const file = this.selectedFile();
    if (!file) {
      return;
    }

    this.isUploading.set(true);
    this.uploadError.set(null);

    this.tasksStore.uploadDocumentForExtraction({
      data: file,
      onSuccess: () => {
        this.isUploading.set(false);
        this.router.navigate(['/tasks/review']);
      },
      onError: (error: any) => {
        this.isUploading.set(false);
        this.uploadError.set(
          error?.message || 'An error occurred while uploading the document. Please try again.',
        );
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks/list']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
