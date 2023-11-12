import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../interfaces/Category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  public getUsersCurrencies(): Observable<Category[]> {
    return this.http
      .get<Category[]>("/api/user/categories", {withCredentials: true});
  }

}
