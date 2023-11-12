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
   * Добавление новой валюты в список валют пользователя
   * @param currencyCode буквенный код валюты
   */
  public attachCurrencyToUser(currencyCode: string): Observable<Currency> {
    if (!currencyCode)
      console.error("currencyCode is null or undefined");
    if (currencyCode.length != 3)
      console.error("currencyCode length must equals 3, but now is " + currencyCode.length);

    return this.http.post<Currency>("/api/user/currency/" + currencyCode.toUpperCase(), {}, {withCredentials: true});
  }

  /**
   * Формирование полного имени валюты
   * @param currency
   */
  public getFullName(currency: Currency): string {
    return currency.name + ' (' + currency.code + ')';
  }
}
