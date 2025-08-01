import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageInputComponent),
      multi: true,
    },
  ],
})
export class ImageInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label = 'Sélectionnez une image';
  @Input() aspectRatio = 1;
  @Input() maxWidth = 0;
  @Input() maxHeight = 0;
  @Input() required = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl | null = null;
  showCropper = false;
  selectedFile: File | null = null;
  errorMessage = '';

  private readonly sanitizer = inject(DomSanitizer);
  private readonly allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
  private readonly maxFileSize = 50 * 1024 * 1024;
  private escapeListener?: (event: KeyboardEvent) => void;

  ngOnInit(): void {
    this.escapeListener = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && this.showCropper) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.cancelCrop();
      }
    };
    document.addEventListener('keydown', this.escapeListener, { capture: true, passive: false });
  }

  ngOnDestroy(): void {
    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener, { capture: true });
    }
  }

  private onChange = (_value: File | null): void => {
    // Callback method for ControlValueAccessor
  };
  private onTouched = (): void => {
    // Callback method for ControlValueAccessor
  };

  // ControlValueAccessor methods
  writeValue(value: File | null): void {
    this.selectedFile = value;
    if (!value) {
      this.croppedImage = null;
      this.showCropper = false;
      this.imageChangedEvent = null;
      this.errorMessage = '';
    }
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      return;
    }

    // Valider le type de fichier
    if (!this.allowedTypes.includes(file.type)) {
      this.errorMessage = 'Format non supporté. Veuillez sélectionner une image PNG, JPG ou JPEG.';
      this.clearSelection();
      return;
    }

    // Valider la taille du fichier
    if (file.size > this.maxFileSize) {
      this.errorMessage = 'La taille du fichier ne doit pas dépasser 50MB.';
      this.clearSelection();
      return;
    }

    // Si toutes les validations passent, continuer
    this.errorMessage = '';
    this.imageChangedEvent = event;
    this.showCropper = true;
    this.onTouched();
  }

  onImageCropped(event: ImageCroppedEvent): void {
    if (event.blob) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.blob));
      // Créer un File à partir du blob
      const file = new File([event.blob], 'cropped-image.png', { type: 'image/png' });
      this.selectedFile = file;
      this.onChange(file);
    }
  }

  onImageLoaded(_image: LoadedImage): void {
    // L'image est chargée dans le cropper
  }

  onCropperReady(): void {
    // Le cropper est prêt
  }

  onLoadImageFailed(): void {
    console.error("Erreur lors du chargement de l'image");
    this.showCropper = false;
  }

  confirmCrop(): void {
    this.showCropper = false;
  }

  cancelCrop(): void {
    this.showCropper = false;
    this.clearSelection();
    this.onChange(null);
  }

  onDialogClick(event: Event): void {
    // Fermer le modal si on clique sur le backdrop
    if (event.target === event.currentTarget) {
      this.cancelCrop();
    }
  }

  onOverlayClick(event: Event): void {
    // Fermer le modal si on clique sur l'overlay (backdrop)
    if (event.target === event.currentTarget) {
      this.cancelCrop();
    }
  }

  // Méthode publique pour que le parent puisse fermer le cropper
  public closeCropper(): void {
    if (this.showCropper) {
      this.cancelCrop();
    }
  }

  removeImage(): void {
    this.clearSelection();
    this.errorMessage = '';
    this.onChange(null);
  }

  openFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  private clearSelection(): void {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.selectedFile = null;
    this.showCropper = false;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
