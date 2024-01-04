import {Component, Input, OnInit} from '@angular/core';
import {AddEditDialogMode} from "../../enums/AddEditDialogMode";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../../service/account.service";
import {CurrencyService} from "../../service/currency.service";

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.css']
})
export class AccountDialogComponent implements OnInit {
  @Input() mode!: AddEditDialogMode;
  @Input() accountId!: any;
  dialogMode = AddEditDialogMode;
  formGroup!: FormGroup<any>;
  formReady: boolean = false;
  submitButtonDisabled: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              private accountService: AccountService,
              private currencyService: CurrencyService,
              private fb: FormBuilder) {

  }

  get initialBalance() {
    return this.formGroup.get('initialBalance') as FormArray;
  }

  ngOnInit(): void {
    if (this.mode === AddEditDialogMode.ADD) {
      let subscription = this.currencyService.getUsersCurrencies().subscribe({
        next: userCurrencies => {
          this.formGroup = this.fb.group({
            name: '',
            description: '',
            initialBalance: this.fb.array(userCurrencies.map(currency => this.fb.group({
              accountId: null,
              amount: '0',
              currencyCode: currency.code
            })))
          });
          this.formReady = true;
        },
        error: err => {
          console.error(err);
        },
        complete: () => {
          subscription?.unsubscribe();
        }
      });
    } else if (this.mode === AddEditDialogMode.EDIT && this.accountId) {
      this.accountService.findUserAccountSummaryByAccountId(this.accountId)
        .subscribe({
          next: value => {
            this.formGroup = this.fb.group(
              {
                name: value.name,
                description: value.description,
                initialBalance: this.fb.array(value.initialBalance.map(item => this.fb.group({
                  accountId: item.accountId,
                  amount: item.amount,
                  currencyCode: item.currencyCode
                })))
              }
            );
            this.formReady = true;
          },
          error: err => {
            console.error(err);
          }
        })
    } else {
      console.error("CategoriesAddEditDialogComponent. Не передана id категории для редактирования.")
    }
  }


  createAccount() {

  }

  updateAccount() {

  }
}
