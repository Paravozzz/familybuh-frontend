import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../interfaces/Category";
import {CategoryCreate} from "../interfaces/CategoryCreate";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  public getUsersCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>("/api/user/categories", {withCredentials: true});
  }

  public findById(id: number): Observable<Category> {
    return this.http
      .get<Category>("/api/user/category/"+id, {withCredentials: true});
  }

  public create(categoryCreate: CategoryCreate): Observable<Category> {
    return this.http
      .post<Category>("/api/user/category", categoryCreate, {withCredentials: true});
  }

  public updateById(id: number, category: CategoryCreate ): Observable<Category> {
    return this.http
      .put<Category>("/api/user/category/"+id, category,{withCredentials: true});
  }

}
