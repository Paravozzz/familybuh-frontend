import {Component, Inject, OnInit} from '@angular/core';
import {CategoriesAddEditDialogMode} from "../../enums/CategoriesAddEditDialogMode";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../../service/category.service";
import {Category} from "../../interfaces/Category";

export interface CategoryDialogData {
  mode: CategoriesAddEditDialogMode,
  categoryId?: number
}

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {

  public categoryControlGroup!: FormGroup<any>;
  public formReady: boolean = false;
  //TODO: сделать спиннер на время загрузки категории при редактировании
  //TODO: заблочить кнопку Создать на время выполнения запроса. Обработать ситуацию с неудачным созданием/обновлением.
  //TODO: перезагружать категории после создания/обновления категории и обработать ситуацию, когда перезагрузка категорий не удалась.
  constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
              private categoryService: CategoryService,
              private fb: FormBuilder) {

  }

  ngOnInit(): void {
    if (this.data.mode === CategoriesAddEditDialogMode.ADD) {
      this.formReady = true;
      this.categoryControlGroup = this.fb.group({
        id: 0,
        name: 'Продукты',
        isIncome: 'false'
      });

    } else if (this.data.categoryId) {
      this.categoryService.findById(this.data.categoryId)
        .subscribe({
          next: value => {
            this.categoryControlGroup = this.fb.group(value);
            this.formReady = true;
          },
          error: err => {
            console.error(err);
          }
        })
    } else {
      console.error("CategoriesAddEditDialogComponent. Не передана id категории для редактирования.")
    }
  }

  createCategory() {
    const category: Category = this.categoryControlGroup.getRawValue();
    this.categoryService.create({name: category.name, isIncome: category.isIncome})
      .subscribe({
        next: value => {
          this.dialogRef.close(value);
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
