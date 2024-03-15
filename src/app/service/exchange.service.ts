import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {ExchangeDto} from "../interfaces/ExchangeDto";
import {ExchangeCreate} from "../interfaces/ExchangeCreate";

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor(private http: HttpClient) {
  }

  private _dailyExchanges: Subject<ExchangeDto[]> = new Subject<ExchangeDto[]>();

  /**
   * Подписка на получение операция по обмену валют за день
   */
  get dailyExchanges(): Observable<ExchangeDto[]> {
    return this._dailyExchanges.asObservable();
  }

  /**
   * Создать операцию по обмену валют
   * @param exchangeCreate
   */
  public exchange(exchangeCreate: ExchangeCreate): Observable<ExchangeDto> {
    return this.http.post<ExchangeDto>("/api/user/exchange", exchangeCreate, {withCredentials: true});
  }

  /**
   * Обновить операции по обмену валют за день. Нужно подписаться на dailyExchanges
   * @param isoDate дата в формате ISO
   */
  public dailyExchangesUpdate(isoDate: string): void {
    let params: HttpParams = new HttpParams();
    params = params.set("date", isoDate);
    const dailyExchangesSubscription = this.http.get<ExchangeDto[]>("/api/user/exchanges/daily", {
      withCredentials: true,
      params: params
    }).subscribe({
      next: exchanges => {
        this._dailyExchanges.next(exchanges);
      }, complete: () => {
        dailyExchangesSubscription?.unsubscribe();
      }, error: err => {
        dailyExchangesSubscription?.unsubscribe();
      }
    });
  }
}
