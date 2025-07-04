import { Component, inject, ViewChild } from '@angular/core';
import { ProductListComponent } from '../../components/products/product-list/product-list.component';
import { ProductFormComponent } from '../../components/products/product-form/product-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductService } from '../../services/product.service'; 
import { ModalService } from '../../services/modal.service'; 
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct } from '../../interfaces';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    ProductFormComponent,
    ReactiveFormsModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  public productService: ProductService = inject(ProductService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addProductModal') public addProductModal: any;
  public fb: FormBuilder = inject(FormBuilder);


productForm = this.fb.group({
  id: this.fb.control<number | null>(null),
  name: ['', Validators.required],
  description: ['', Validators.required],
  price: [0, [Validators.required, Validators.min(0.01)]],
  stock: [0, [Validators.required, Validators.min(0)]],
  categoryId: this.fb.control<number | null>(null, Validators.required) 
});

  constructor() {
    this.productService.search.page = 1;
    this.productService.getAll();
  }


  saveProduct(product: IProduct) {
    this.productService.save(product);
    this.modalService.closeAll();
    this.productForm.reset();
  }


callEdition(product: IProduct) {
  this.productForm.controls['id'].setValue(product.id ?? null);
  this.productForm.controls['name'].setValue(product.name ?? null);
  this.productForm.controls['description'].setValue(product.description ?? null);
  this.productForm.controls['price'].setValue(product.price ?? null);
  this.productForm.controls['stock'].setValue(product.stock ?? null);
  this.productForm.controls['categoryId'].setValue(product.category?.id ?? null);

  this.modalService.displayModal('md', this.addProductModal);
}

  updateProduct(product: IProduct) {
    this.productService.update(product);
    this.modalService.closeAll();
    this.productForm.reset();
  }
}