import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OperationDto} from "../interfaces/OperationDto";
import {OperationCreate} from "../interfaces/OperationCreate";

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private http: HttpClient) {
  }

  public expense(operationCreate: OperationCreate): Observable<OperationDto> {
    return this.http.post<OperationDto>("/api/user/operation/expense", operationCreate, {withCredentials: true});
  }

  public income(operationCreate: OperationCreate): Observable<OperationDto> {
    return this.http.post<OperationDto>("/api/user/operation/income", operationCreate, {withCredentials: true});
  }
}
