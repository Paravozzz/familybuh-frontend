import {Component, OnInit} from '@angular/core';
import {AccountSummary} from "../../../interfaces/AccountSummary";
import {AccountService} from "../../../service/account.service";
import {tap} from "rxjs";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  userAccountsLoaded: boolean = false;
  userAccountSummaries: AccountSummary[] = [];

  constructor(private accountService: AccountService) {
  }

  ngOnInit(): void {
    this._fetchAccounts();
  }

  openAddDialog() {

  }

  openEditDialog(accountSummary: AccountSummary) {

  }

  private _fetchAccounts() {
    this.userAccountsLoaded = false;
    let subscription = this.accountService.getUsersAccountSummaries().pipe(
      tap(summaries => {
        if (!summaries) {
          this.userAccountSummaries = [];
        } else {
          this.userAccountSummaries = summaries;
        }
        this.userAccountsLoaded = true;
      })
    ).subscribe({
      complete: () => {
        subscription?.unsubscribe();
      }
    });
  }
}
