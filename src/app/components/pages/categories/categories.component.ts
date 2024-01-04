import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../service/category.service";
import {Category} from "../../../interfaces/Category";
import {Observable, tap} from "rxjs";
import {AddEditDialogMode} from "../../../enums/AddEditDialogMode";
import {CategoryDialogComponent} from "../../category-dialog/category-dialog.component";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {
  userCategoriesLoaded: boolean = false;
  userCategories: Observable<Category[]> | undefined;

  constructor(private modalService: NgbModal, private categoryService: CategoryService) {
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
    const modalRef: NgbModalRef = this.modalService.open(CategoryDialogComponent, {centered: true, backdrop: "static", keyboard:false});
    modalRef.componentInstance.mode = AddEditDialogMode.ADD;
    modalRef.closed.subscribe({
      next: value => {
        this.userCategories = this._fetchCategories();
      }
    })
  }

  openEditDialog(categoryId: number) {
    const modalRef: NgbModalRef = this.modalService.open(CategoryDialogComponent, {centered: true, backdrop: "static", keyboard:false});
    modalRef.componentInstance.mode = AddEditDialogMode.EDIT;
    modalRef.componentInstance.categoryId = categoryId;

    modalRef.closed.subscribe({
      next: value => {
        this.userCategories = this._fetchCategories();
      }
    })
  }

}
