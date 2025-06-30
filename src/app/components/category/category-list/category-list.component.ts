import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../../interfaces';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  @Input({ required: true }) categories: ICategory[] = [];
  @Output() callModalAction: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  @Output() callDeleteAction: EventEmitter<ICategory> = new EventEmitter<ICategory>();

  edit(category: ICategory) {
    this.callModalAction.emit(category);
  }

  delete(category: ICategory) {
    this.callDeleteAction.emit(category);
  }
}
