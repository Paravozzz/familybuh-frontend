import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../service/category.service";
import {Category} from "../../interfaces/Category";
import {Observable, tap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {CategoriesAddEditDialogMode} from "../../enums/CategoriesAddEditDialogMode";
import {CategoryDialogComponent} from "../category-dialog/category-dialog.component";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {
  userCategoriesLoaded: boolean = false;
  userCategories: Observable<Category[]> | undefined;

  constructor(public dialog: MatDialog, private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.userCategories = this._fetchCategories();
  }

  private _fetchCategories() {
    this.userCategoriesLoaded = false;
    return this.categoryService.getUsersCategories().pipe(
      tap(value => {
        this.userCategoriesLoaded = true;
      })
    );
  }

  trackById(index: number, item: Category) {
    return item.id;
  }

  openAddDialog() {
    const matDialogRef = this.dialog.open(CategoryDialogComponent,
      {
        data:
          {
            mode: CategoriesAddEditDialogMode.ADD
          }
      });

    matDialogRef.afterClosed().subscribe({
      next: value => {
        this.userCategories = this._fetchCategories();
      }
    })
  }

  openEditDialog(categoryId: number) {
    const matDialogRef = this.dialog.open(CategoryDialogComponent, {
      data: {
        mode: CategoriesAddEditDialogMode.EDIT,
        categoryId: categoryId
      }
    });

    matDialogRef.afterClosed().subscribe({
      next: value => {
        this.userCategories = this._fetchCategories();
      }
    })
  }

}
