import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IProduct, ISearch } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<IProduct> {
  protected override source: string = 'products';
  private productListSignal = signal<IProduct[]>([]);
  get products$() {
    return this.productListSignal;
  }
  public search: ISearch = {
    page: 1,
    size: 10
  }
  public totalItems: number[] = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size}).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.productListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error al obtener productos:', err);
        this.alertService.displayAlert('error', 'Ocurrió un error al cargar los productos','center', 'top', ['error-snackbar']);
      }
    });
  }

  save(product: IProduct) {
    this.add(product).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al añadir el producto','center', 'top', ['error-snackbar']);
        console.error('Error al guardar producto:', err);
      }
    });
  }

  update(product: IProduct) {
    if (!product.id) {
      this.alertService.displayAlert('error', 'ID de producto no proporcionado para la actualización','center', 'top', ['error-snackbar']);
      return;
    }
    this.editCustomSource(`${product.id}`, product).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al actualizar el producto','center', 'top', ['error-snackbar']);
        console.error('Error al actualizar producto:', err);
      }
    });
  }

  delete(product: IProduct) {
    if (!product.id) {
      this.alertService.displayAlert('error', 'ID de producto no proporcionado para la eliminación','center', 'top', ['error-snackbar']);
      return;
    }
    this.delCustomSource(`${product.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al eliminar el producto','center', 'top', ['error-snackbar']);
        console.error('Error al eliminar producto:', err);
      }
    });
  }
}