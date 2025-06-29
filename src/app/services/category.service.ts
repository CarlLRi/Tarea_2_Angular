import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICategory, ISearch } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService<ICategory> {
  protected override source: string = 'categories';
  private categoryListSignal = signal<ICategory[]>([]);
  get categories$() {
    return this.categoryListSignal;
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
        this.categoryListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error al obtener categorías:', err);
        this.alertService.displayAlert('error', 'Ocurrió un error al cargar las categorías','center', 'top', ['error-snackbar']);
      }
    });
  }

  save(category: ICategory) {
    this.add(category).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al añadir la categoría','center', 'top', ['error-snackbar']);
        console.error('Error al guardar categoría:', err);
      }
    });
  }

  update(category: ICategory) {
    if (!category.id) {
      this.alertService.displayAlert('error', 'ID de categoría no proporcionado para la actualización','center', 'top', ['error-snackbar']);
      return;
    }
    this.editCustomSource(`${category.id}`, category).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al actualizar la categoría','center', 'top', ['error-snackbar']);
        console.error('Error al actualizar categoría:', err);
      }
    });
  }

  delete(category: ICategory) {
    if (!category.id) {
      this.alertService.displayAlert('error', 'ID de categoría no proporcionado para la eliminación','center', 'top', ['error-snackbar']);
      return;
    }
    this.delCustomSource(`${category.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al eliminar la categoría','center', 'top', ['error-snackbar']);
        console.error('Error al eliminar categoría:', err);
      }
    });
  }
}