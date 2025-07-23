import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-base-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-modal.component.html',
  styleUrl: './base-modal.component.scss',
})
export class BaseModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('dialog', { static: false }) dialog!: ElementRef<HTMLDialogElement>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.dialog) {
      if (this.isOpen) {
        this.dialog.nativeElement.showModal();
      } else {
        this.dialog.nativeElement.close();
      }
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === this.dialog.nativeElement) {
      this.onClose();
    }
  }
}
