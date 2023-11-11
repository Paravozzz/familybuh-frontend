import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, switchMap, tap} from "rxjs";
import {InitCreate} from "../interfaces/InitCreate";

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(private http: HttpClient) { }

  checkInit(): Observable<boolean> {
    return this.http.get<boolean>("/api/init", {withCredentials: true});
  }

  init(currencyCode: string): Observable<boolean> {
    const initCreate: InitCreate = <InitCreate>{};
    initCreate.currencyCode = currencyCode;
    return this.http.post("/api/init", initCreate, {withCredentials: true}).pipe(
      switchMap(()=> {
        return this.checkInit();
      }),
      catchError(error => {
        throw new Error(error);
      })
    );
  }

}
