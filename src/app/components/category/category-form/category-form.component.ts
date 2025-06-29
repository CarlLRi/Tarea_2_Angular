import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategory } from '../../../interfaces';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  @Input({ required: true }) categoryForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  @Output() callUpdateMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();

  callSaveOrUpdate() {
    if (this.categoryForm.valid) {
      const categoryToSave: ICategory = this.categoryForm.value as ICategory;
      if (categoryToSave.id) {
        this.callUpdateMethod.emit(categoryToSave);
      } else {
        this.callSaveMethod.emit(categoryToSave);
      }
    }
  }
}