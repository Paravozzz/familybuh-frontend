import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {TransferCreate} from "../interfaces/TransferCreate";
import {TransferDto} from "../interfaces/TransferDto";

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  constructor(private http: HttpClient) {
  }

  private _dailyTransfers: Subject<TransferDto[]> = new Subject<TransferDto[]>();

  /**
   * Подписка на получение переводов за день
   */
  get dailyTransfers(): Observable<TransferDto[]> {
    return this._dailyTransfers.asObservable();
  }

  /**
   * Создать перевод
   * @param transferCreate
   */
  public transfer(transferCreate: TransferCreate): Observable<TransferDto> {
    return this.http.post<TransferDto>("/api/user/transfer", transferCreate, {withCredentials: true});
  }

  /**
   * Обновить переводы за день. Нужно подписаться на dailyTransfers
   * @param isoDate дата в формате ISO
   */
  public dailyTransfersUpdate(isoDate: string): void {
    let params: HttpParams = new HttpParams();
    params = params.set("date", isoDate);
    const dailyTransfersSubscription = this.http.get<TransferDto[]>("/api/user/transfers/daily", {
      withCredentials: true,
      params: params
    }).subscribe({
      next: transfers => {
        this._dailyTransfers.next(transfers);
      }, complete: () => {
        dailyTransfersSubscription?.unsubscribe();
      }, error: err => {
        dailyTransfersSubscription?.unsubscribe();
      }
    });
  }

}
