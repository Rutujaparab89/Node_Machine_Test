import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html'
})
export class Product implements OnInit {

  products: any[] = [];
  categories: any[] = [];
  productName = '';
  categoryId: number | null = null;
  editId: number | null = null;

  page = 1;
  limit = 5;
  totalPages = 1;

  private API = 'http://localhost:3000/products';
  private CAT_API = 'http://localhost:3000/categories';


  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}
  ngOnInit() {
    this.loadProducts(1);
    this.loadCategories();
  }

  //  LOAD PRODUCTS
  loadProducts(page: number = 1) {
  this.http
    .get<any>(`${this.API}?page=${page}&limit=${this.limit}`)
    .subscribe(res => {
      console.log(res); // 👈 MUST SEE data, page, totalPages

      this.products = res.data;
      this.page = res.page;
      this.totalPages = res.totalPages;
      this.cd.detectChanges();
    });
  }


  //  LOAD CATEGORIES
  loadCategories() {
    this.http.get<any[]>(this.CAT_API).subscribe(res => {
      this.categories = [...res]; // important for Angular change detection
      this.cd.detectChanges(); 
    });
  }

  //  ADD PRODUCT
  addProduct() {
    if (!this.productName.trim() || this.categoryId === null) return;

    this.http.post(this.API, {
      product_name: this.productName,
      category_id: this.categoryId
    }).subscribe(() => {
      this.resetForm();
      this.loadProducts(); // refresh table immediately
    });
  }

  //  EDIT CLICK
  editProduct(p: any) {
    this.productName = p.product_name;
    this.categoryId = p.category_id;
    this.editId = p.product_id;
  }

  //  UPDATE PRODUCT
  updateProduct() {
    if (!this.productName.trim() || this.categoryId === null || this.editId === null) return;

    this.http.put(`${this.API}/${this.editId}`, {
      product_name: this.productName,
      category_id: this.categoryId
    }).subscribe(() => {
      this.resetForm();
      this.loadProducts(); // refresh table immediately
    });
  }

  //  DELETE PRODUCT
  deleteProduct(id: number) {
    this.http.delete(`${this.API}/${id}`).subscribe(() => {
      this.loadProducts(); // refresh table immediately
    });
  }

  //  RESET FORM
  resetForm() {
    this.productName = '';
    this.categoryId = null;
    this.editId = null;
  }

  prevPage() {
  if (this.page > 1) {
    this.loadProducts(this.page - 1);
  }
}

nextPage() {
  if (this.page < this.totalPages) {
    this.loadProducts(this.page + 1);
  }
}

}
