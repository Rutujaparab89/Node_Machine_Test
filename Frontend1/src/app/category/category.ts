import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html'
})
export class Category implements OnInit {

  categories: any[] = [];
  categoryName = '';
  editId: number | null = null;

  private API = 'http://localhost:3000/categories';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCategories();
  }

  // LOAD
  loadCategories() {
    this.http.get<any[]>(this.API).subscribe(res => {
      this.categories = [...res]; // Spread operator triggers change detection
      this.cd.detectChanges(); // Ensure Angular updates view immediately
    });
  }

  //  ADD
  addCategory() {
    if (!this.categoryName.trim()) return;

    this.http.post(this.API, { category_name: this.categoryName })
      .subscribe(() => {
        this.resetForm();
        this.loadCategories();
      });
  }

  //  EDIT CLICK
  editCategory(cat: any) {
    this.categoryName = cat.category_name;
    this.editId = cat.category_id;
  }

  // UPDATE
  updateCategory() {
    if (!this.categoryName.trim() || this.editId === null) return;

    this.http.put(`${this.API}/${this.editId}`, { category_name: this.categoryName })
      .subscribe(() => {
        this.resetForm();
        this.loadCategories();
      });
  }

  //  DELETE
  deleteCategory(id: number) {
    this.http.delete(`${this.API}/${id}`)
      .subscribe(() => this.loadCategories());
  }

  //  RESET FORM
  resetForm() {
    this.categoryName = '';
    this.editId = null;
  }
}
