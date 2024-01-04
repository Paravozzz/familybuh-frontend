import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Account} from "../interfaces/Account";
import {AccountSummary} from "../interfaces/AccountSummary";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {
  }

  public getUsersAccounts(): Observable<Account[]> {
    return this.http
      .get<Account[]>("/api/user/accounts", {withCredentials: true});
  }

  /**
   * Получение обобщённой информации по счётам пользователя
   */
  public getUsersAccountSummaries(): Observable<AccountSummary[]> {
    return this.http
      .get<AccountSummary[]>("/api/user/account-summaries", {withCredentials: true});
  }

  /**
   * Поиск обобщённой информации по счёту по одному из идентификаторов
   * @param accountId идентификатор счёта
   */
  public findUserAccountSummaryByAccountId(accountId: number): Observable<AccountSummary> {
    return this.http
      .get<AccountSummary>("/api/user/account-summary/"+accountId, {withCredentials: true});
  }

}
