import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Currency} from "../interfaces/Currency";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) {
  }

  /**
   * Справочник валют
   */
  public getAll(): Observable<Currency[]> {
    return this.http
      .get<Currency[]>("/api/currencies", {withCredentials: true});
  }

  /**
   * Список валют у пользователя
   */
  public getUsersCurrencies(): Observable<Currency[]> {
    return this.http
      .get<Currency[]>("/api/user/currencies", {withCredentials: true});
  }

  /**
   * Формирование полного имени валюты
   * @param currency
   */
  public getFullName(currency: Currency): string {
    return currency.name + ' (' + currency.code + ')';
  }
}
