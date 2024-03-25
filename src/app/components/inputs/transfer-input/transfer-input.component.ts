import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CurrencyService} from "../../../service/currency.service";
import {AccountService} from "../../../service/account.service";
import {SettingService} from "../../../service/setting.service";
import {TransferService} from "../../../service/transfer.service";
import {DateService} from "../../../service/date.service";
import {Observable, Subscription, tap} from "rxjs";
import {Currency} from "../../../interfaces/Currency";
import {environment} from "../../../../environments/environment";
import {TransferCreate} from "../../../interfaces/TransferCreate";
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {
  amountCorrectValueValidator,
  amountPositiveOrZeroValueValidator
} from "../../shared/validators/amount.validators";

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-transfer-input',
  templateUrl: './transfer-input.component.html',
  styleUrls: ['./transfer-input.component.css']
})
export class TransferInputComponent implements OnInit {
  formReady: boolean = false;
  public transferInputForm: FormGroup;

  userCurrencies!: Observable<Currency[]>;
  userCurrenciesLoaded: boolean = false;
  selectedCurrency: Currency = <Currency>{code: "000"};

  userAccountNames: string[] = [];
  userAccountsLoaded: boolean = false;
  selectedExpenseAccountName: string = "";
  selectedIncomeAccountName: string = "";

  saveButtonDisabled: boolean = false;

  lastTransferCurrencySettingName!: string;
  lastTransferCurrencyLoaded: boolean = false;

  lastTransferExpenseAccountSettingName!: string;
  lastTransferExpenseAccountLoaded: boolean = false;

  lastTransferIncomeAccountSettingName!: string;
  lastTransferIncomeAccountLoaded: boolean = false;

  hours: number[];
  minutes: number[];

  subscription?: Subscription;

  /**
   * Мапа для поиска идентификатора счёта по его имени и буквенному коду валюты
   * @private
   */
  private _accountsMap: Map<string, number> = new Map<string, number>();

  constructor(private currencyService: CurrencyService,
              private accountService: AccountService,
              private settingService: SettingService,
              private transferService: TransferService,
              private fb: FormBuilder,
              private dateService: DateService) {
    this.transferInputForm = this.fb.group({
      amount: ["0", [Validators.required, amountCorrectValueValidator(), amountPositiveOrZeroValueValidator()]],
      currencyCode: ["0"],
      expenseAccountName: ["0"],
      incomeAccountName: ["0"],
      description: [""],
      date: [dateService.today],
      hour: [""],
      minute: [""]
    });
    this.transferInputForm.disable();
    this.saveButtonDisabled = true;
    this.hours = [];
    for (let i = 0; i <= 23; i++) {
      this.hours.push(i);
    }
    this.minutes = [];
    for (let i = 0; i <= 59; i++) {
      this.minutes.push(i);
    }
  }

  ngOnInit(): void {
    this._initConstants();

    //Валюты
    this._loadCurrencies();

    //Счета
    this._loadAccounts();
  }

  transferSave() {
    this.saveButtonDisabled = true;
    let value = this.transferInputForm.value;
    value.date = this.dateService.computeDateAndTime(value);
    value.expenseAccountId = this._computeAccountId(value.expenseAccountName, value.currencyCode);
    value.incomeAccountId = this._computeAccountId(value.incomeAccountName, value.currencyCode);
    const transfer: TransferCreate = <TransferCreate>value;
    transfer.amount = transfer.amount.trim();
    this.transferService.transfer(transfer).subscribe({
      next: value => {
        this._saveOperationDefaults(transfer.currencyCode, transfer.expenseAccountId, transfer.incomeAccountId);
      }, complete: () => {
        this._afterOperationCreate();
      }, error: err => {
        this._afterOperationCreate();
      }
    });
  }

  private _initConstants() {
    this.lastTransferCurrencySettingName = environment.constants.last_transfer_currency
    this.lastTransferExpenseAccountSettingName = environment.constants.last_transfer_expense_account_id;
    this.lastTransferIncomeAccountSettingName = environment.constants.last_transfer_income_account_id;
  }

  private _loadCurrencies() {
    this.userCurrencies = this.currencyService.getUsersCurrencies().pipe(
      tap(userCurrencies => {
        this.userCurrenciesLoaded = true;
        this._isLoaded();

        this.settingService.findByName(this.lastTransferCurrencySettingName).subscribe(setting => {
          if (setting?.value) {
            this.selectedCurrency = userCurrencies.filter(currency => currency.code == setting.value.toUpperCase())[0];
          } else {
            this.selectedCurrency = userCurrencies[0];
          }
          this.lastTransferCurrencyLoaded = true;
          this._isLoaded();
        })
      })
    );
  }

  private _loadAccounts() {
    let subscription1 = this.accountService.getUsersAccounts().pipe(
      tap(userAccounts => {
        this._accountsMap.clear();
        userAccounts.forEach(account => {
          this._accountsMap.set(this.accountService.accountsHashCode(account), account.id);
        });
        this.userAccountNames = [...new Set<string>(userAccounts.map(account => account.name))];
        this.userAccountsLoaded = true;
        this._isLoaded();

        this.settingService.findByName(this.lastTransferExpenseAccountSettingName).subscribe(setting => {
          if (setting?.value) {
            this.selectedExpenseAccountName = userAccounts.filter(account => account.id == Number.parseInt(setting.value))[0].name;
          } else {
            this.selectedExpenseAccountName = userAccounts[0].name;
          }
          this.lastTransferExpenseAccountLoaded = true;
          this._isLoaded();
        })

        this.settingService.findByName(this.lastTransferIncomeAccountSettingName).subscribe(setting => {
          if (setting?.value) {
            this.selectedIncomeAccountName = userAccounts.filter(account => account.id == Number.parseInt(setting.value))[0].name;
          } else {
            this.selectedIncomeAccountName = userAccounts[0].name;
          }
          this.lastTransferIncomeAccountLoaded = true;
          this._isLoaded();
        })
      })
    ).subscribe({
      complete: () => {
        subscription1?.unsubscribe();
      }
    });
  }

  private _isLoaded(): void {
    this.transferInputForm.patchValue({
      currencyCode: this.selectedCurrency.code,
    });
    this.transferInputForm.patchValue({
      expenseAccountName: this.selectedExpenseAccountName,
    });
    this.transferInputForm.patchValue({
      incomeAccountName: this.selectedIncomeAccountName
    });
    const result = this.userCurrenciesLoaded && this.userAccountsLoaded &&
      this.lastTransferCurrencyLoaded &&
      this.lastTransferExpenseAccountLoaded && this.lastTransferIncomeAccountLoaded;
    this.formReady = result;
    if (this.formReady) {
      this.transferInputForm.enable();
      this.saveButtonDisabled = false;
    }
  }

  private _computeAccountId(accountName: string, currencyCode: string): number {
    let accountId: number = 0;
    accountId = this._accountsMap.get(this.accountService.accountsHashCode2(accountName, currencyCode)) ?? 0;
    return accountId;
  }

  private _saveOperationDefaults(currencyCode: string, expenseAccountId: number, incomeAccountId: number) {
    this.settingService.save({name: this.lastTransferCurrencySettingName, value: currencyCode})
      .subscribe(() => {
      });

    this.settingService.save({name: this.lastTransferExpenseAccountSettingName, value: expenseAccountId.toString()})
      .subscribe(() => {
      });

    this.settingService.save({name: this.lastTransferIncomeAccountSettingName, value: incomeAccountId.toString()})
      .subscribe(() => {
      });
  }

  private _afterOperationCreate() {
    this.saveButtonDisabled = false;
    this.subscription?.unsubscribe();
    this.transferService.dailyTransfersUpdate(this.dateService.computeDateAndTime(this.transferInputForm.getRawValue()));
  }

  controlHasError(controlName: string, errorName: string) {
    return this.transferInputForm.get(controlName)?.getError(errorName);
  }

  controlIsInvalid(controlName: string): boolean {
    let abstractControl = this.transferInputForm.get(controlName);
    return (abstractControl?.invalid && (abstractControl?.dirty || abstractControl?.touched)) ?? false
  }
}
