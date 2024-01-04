import {Component, Input, OnInit} from '@angular/core';
import {AddEditDialogMode} from "../../enums/AddEditDialogMode";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CategoryService} from "../../service/category.service";
import {Category} from "../../interfaces/Category";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {
  @Input() mode!: AddEditDialogMode;
  @Input() categoryId!: any;
  dialogMode = AddEditDialogMode;
  categoryControlGroup!: FormGroup<any>;
  formReady: boolean = false;
  submitButtonDisabled: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              private categoryService: CategoryService,
              private fb: FormBuilder) {

  }

  ngOnInit(): void {
    if (this.mode === AddEditDialogMode.ADD) {
      this.categoryControlGroup = this.fb.group({
        id: 0,
        name: '',
        isIncome: 'false'
      });
      this.formReady = true;
    } else if (this.mode === AddEditDialogMode.EDIT && this.categoryId) {
      this.categoryService.findById(this.categoryId)
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
          this.activeModal.close(value);
        },
        error: err => {
          this.submitButtonDisabled = false;
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
          this.activeModal.close(value);
        },
        error: err => {
          this.submitButtonDisabled = false;
          console.error(err);
        }, complete: () => {
          this.submitButtonDisabled = false;
        }
      })
  }
}
