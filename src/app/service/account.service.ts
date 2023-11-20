import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Account} from "../interfaces/Account";

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
}
