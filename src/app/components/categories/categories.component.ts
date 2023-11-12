import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../service/category.service";
import {Category} from "../../interfaces/Category";
import {Observable, tap} from "rxjs";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  userCategoriesLoaded: boolean = false;
  userCategories: Observable<Category[]> | undefined;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.userCategories = this.categoryService.getUsersCurrencies().pipe(
      tap(value => {
        this.userCategoriesLoaded = true;
      })
    )
  }

  trackById(index: number, item: Category) {
    return item.id;
  }

}
