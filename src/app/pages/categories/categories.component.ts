import { Component, inject, ViewChild } from '@angular/core';
import { CategoryListComponent } from '../../components/category/category-list/category-list.component';
import { CategoryFormComponent } from '../../components/category/category-form/category-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CategoryService } from '../../services/category.service'; 
import { ModalService } from '../../services/modal.service'; 
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { ICategory } from '../../interfaces'; 

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CategoryListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    CategoryFormComponent,
    ReactiveFormsModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  public categoryService: CategoryService = inject(CategoryService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addCategoryModal') public addCategoryModal: any;
  public fb: FormBuilder = inject(FormBuilder);

  categoryForm = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    description: ['', Validators.required]
  
  });

  constructor() {
    this.categoryService.search.page = 1;
    this.categoryService.getAll();
  }

  // Método para guardar una nueva categoría
  saveCategory(category: ICategory) {
    this.categoryService.save(category);
    this.modalService.closeAll();
    this.categoryForm.reset(); 
  }


  callEdition(category: ICategory) {
    this.categoryForm.controls['id'].setValue(null);
    this.categoryForm.controls['name'].setValue(category.name);
    this.categoryForm.controls['description'].setValue(category.description);
    this.modalService.displayModal('md', this.addCategoryModal);
  }


  updateCategory(category: ICategory) {
    this.categoryService.update(category);
    this.modalService.closeAll();
    this.categoryForm.reset(); 
  }
}