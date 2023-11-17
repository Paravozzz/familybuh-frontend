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
  dialogMode = CategoriesAddEditDialogMode;
  public categoryControlGroup!: FormGroup<any>;
  public formReady: boolean = false;
  //TODO: сделать спиннер на время загрузки категории при редактировании
  submitButtonDisabled: boolean = false;
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
        name: '',
        isIncome: 'false'
      });

    } else if (this.data.categoryId) {
      this.categoryService.findById(this.data.categoryId)
        .subscribe({
          next: value => {
            this.categoryControlGroup = this.fb.group(
              {
                id: value.id,
                name: value.name,
                isIncome: value.isIncome + ''
              }
            );
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
    this.submitButtonDisabled = true;
    const category: Category = this.categoryControlGroup.getRawValue();
    this.categoryService.create({name: category.name, isIncome: category.isIncome})
      .subscribe({
        next: value => {
          this.dialogRef.close(value);
        },
        error: err => {
          console.error(err);
        }, complete: () => {
          this.submitButtonDisabled = false;
        }
      })
  }

  updateCategory() {
    this.submitButtonDisabled = true;
    const category: Category = this.categoryControlGroup.getRawValue();
    this.categoryService.updateById(category.id,{name: category.name, isIncome: category.isIncome})
      .subscribe({
        next: value => {
          this.dialogRef.close(value);
        },
        error: err => {
          console.error(err);
        }, complete: () => {
          this.submitButtonDisabled = false;
        }
      })
  }
}
