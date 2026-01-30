
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from './product/product';
import { Category } from './category/category';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule,Category, Product],
  template: `
    <h2>Category</h2>
    <app-category></app-category>
    <hr>
    <h2>Product</h2>
    <product></product>
  `
})
export class App {}

