import {Component, OnInit} from '@angular/core';
import {AccountSummary} from "../../../interfaces/AccountSummary";
import {AccountService} from "../../../service/account.service";
import {tap} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AddEditDialogMode} from "../../../enums/AddEditDialogMode";
import {AccountDialogComponent} from "../../account-dialog/account-dialog.component";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  userAccountsLoaded: boolean = false;
  userAccountSummaries: AccountSummary[] = [];

  constructor(private modalService: NgbModal, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this._fetchAccounts();
  }

  openAddDialog() {
    const modalRef: NgbModalRef = this.modalService.open(AccountDialogComponent, {
      centered: true,
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.mode = AddEditDialogMode.ADD;
    modalRef.closed.subscribe({
      next: value => {
        this._fetchAccounts();
      }
    })
  }

  openEditDialog(accountId: number) {
    const modalRef: NgbModalRef = this.modalService.open(AccountDialogComponent, {
      centered: true,
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.mode = AddEditDialogMode.EDIT;
    modalRef.componentInstance.accountId = accountId;

    modalRef.closed.subscribe({
      next: value => {
        this._fetchAccounts();
      }
    })
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
