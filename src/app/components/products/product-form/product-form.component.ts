
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct, ICategory } from '../../../interfaces';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  @Input({ required: true }) productForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callUpdateMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();

  public categoryService: CategoryService = inject(CategoryService);
  public categories$ = this.categoryService.categories$;

  ngOnInit(): void {
  
    if (this.categoryService.categories$().length === 0) {
      this.categoryService.getAll();
    }
  }

  callSaveOrUpdate() {
    if (this.productForm.valid) {
      const productToSave: IProduct = this.productForm.value as IProduct;

      // Si el formulario tiene un ID,
      if (productToSave.id) {
        this.callUpdateMethod.emit(productToSave);
      } else {
        this.callSaveMethod.emit(productToSave);
      }
    }
  }
}