import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, switchMap} from "rxjs";
import {InitCreate} from "../interfaces/InitCreate";

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(private http: HttpClient) {
  }

  /**
   * Проверка - проведена ли начальная настройка пользователя (выбрана валюта, создан мастер счёт под данную валюту)
   */
  public checkInit(): Observable<boolean> {
    return this.http.get<boolean>("/api/init", {withCredentials: true});
  }

  /**
   * Начальная настройка пользователя.
   * @param currencyCode
   */
  public init(currencyCode: string): Observable<boolean> {
    const initCreate: InitCreate = <InitCreate>{};
    initCreate.currencyCode = currencyCode;
    return this.http.post("/api/init", initCreate, {withCredentials: true}).pipe(
      switchMap(() => {
        return this.checkInit();
      }),
      catchError(error => {
        throw new Error(error);
      })
    );
  }

}
