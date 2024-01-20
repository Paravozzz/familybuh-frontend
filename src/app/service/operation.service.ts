import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {OperationDto} from "../interfaces/OperationDto";
import {OperationCreate} from "../interfaces/OperationCreate";
import {OperationTypeEnum} from "../enums/OperationTypeEnum";

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  private _dailyOperations: Subject<OperationDto[]> = new Subject<OperationDto[]>();

  /**
   * Подписка на получение операций за день
   */
  get dailyOperations(): Observable<OperationDto[]> {
    return this._dailyOperations.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  /**
   * Создать расходную операцию
   * @param operationCreate
   */
  public expense(operationCreate: OperationCreate): Observable<OperationDto> {
    return this.http.post<OperationDto>("/api/user/operation/expense", operationCreate, {withCredentials: true});
  }

  /**
   * Создать доходную операцию
   * @param operationCreate
   */
  public income(operationCreate: OperationCreate): Observable<OperationDto> {
    return this.http.post<OperationDto>("/api/user/operation/income", operationCreate, {withCredentials: true});
  }

  /**
   * Обновить операции за день. Нужно подписаться на dailyOperations
   * @param operationType тип операции
   * @param isoDate дата в формате ISO
   */
  public dailyOperationsUpdate(operationType: OperationTypeEnum, isoDate: string): void {
    let params: HttpParams = new HttpParams();
    params = params.set("operationType", operationType);
    params = params.set("date", isoDate);
    const dailyOperationsSubscription = this.http.get<OperationDto[]>("/api/user/operations/daily", {
      withCredentials: true,
      params: params
    }).subscribe({
      next: operations => {
        this._dailyOperations.next(operations);
      }, complete: () => {
        dailyOperationsSubscription?.unsubscribe();
      }, error: err => {
        dailyOperationsSubscription?.unsubscribe();
      }
    });
  }
}
