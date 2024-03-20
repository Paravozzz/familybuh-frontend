import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateService} from "../../../service/date.service";
import {Observable, Subscription, tap} from "rxjs";
import {Currency} from "../../../interfaces/Currency";
import {CurrencyService} from "../../../service/currency.service";
import {AccountService} from "../../../service/account.service";
import {SettingService} from "../../../service/setting.service";
import {environment} from "../../../../environments/environment";
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {ExchangeCreate} from "../../../interfaces/ExchangeCreate";
import {ExchangeService} from "../../../service/exchange.service";
import {
  amountCorrectValueValidator,
  amountPositiveOrZeroValueValidator
} from '../../shared/validators/amount.validators';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-exchange-input',
  templateUrl: './exchange-input.component.html',
  styleUrls: ['./exchange-input.component.css']
})
export class ExchangeInputComponent implements OnInit{
  @Output("loaded") loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public exchangeInputForm: FormGroup;

  userCurrencies!: Observable<Currency[]>;
  userCurrenciesLoaded: boolean = false;
  selectedExpenseCurrency: Currency = <Currency>{code: "000"};
  selectedIncomeCurrency: Currency = <Currency>{code: "000"};
  userAccountNames: string[] = [];
  userAccountsLoaded: boolean = false;
  selectedExchangeAccountName: string = "";

  lastExchangeExpenseCurrencySettingName!: string;
  lastExchangeExpenseCurrencyLoaded: boolean = false;
  lastExchangeIncomeCurrencySettingName !: string;
  lastExchangeIncomeCurrencyLoaded: boolean = false;
  lastExchangeAccountIdSettingName!: string;
  lastExchangeAccountLoaded: boolean = false;

  hours: number[];
  minutes: number[];

  saveButtonDisabled: boolean = false;

  subscription?: Subscription;

  /**
   * Мапа для поиска идентификатора счёта по его имени и буквенному коду валюты
   * @private
   */
  private _accountsMap: Map<string, number> = new Map<string, number>();

  constructor(private currencyService: CurrencyService,
              private accountService: AccountService,
              private settingService: SettingService,
              private exchangeService: ExchangeService,
              private fb: FormBuilder,
              private dateService: DateService) {
    this.exchangeInputForm = this.fb.group({
      expenseAmount: ["0", [Validators.required, amountCorrectValueValidator(), amountPositiveOrZeroValueValidator()]],
      incomeAmount: ["0", [Validators.required, amountCorrectValueValidator(), amountPositiveOrZeroValueValidator()]],
      expenseCurrencyCode: [""],
      incomeCurrencyCode: [""],
      accountName: [""],
      description: [""],
      date: [dateService.today],
      hour: [""],
      minute: [""]
    });
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

  private _initConstants() {
    this.lastExchangeExpenseCurrencySettingName = environment.constants.last_exchange_expense_currency
    this.lastExchangeIncomeCurrencySettingName = environment.constants.last_exchange_income_currency;
    this.lastExchangeAccountIdSettingName = environment.constants.last_exchange_account_id;
  }

  private _loadCurrencies() {
    this.userCurrencies = this.currencyService.getUsersCurrencies().pipe(
      tap(userCurrencies => {
        this.userCurrenciesLoaded = true;
        this._isLoaded();

        this.settingService.findByName(this.lastExchangeExpenseCurrencySettingName).subscribe(setting => {
          if (setting?.value) {
            this.selectedExpenseCurrency = userCurrencies.filter(currency => currency.code == setting.value.toUpperCase())[0];
          } else {
            this.selectedExpenseCurrency = userCurrencies[0];
          }
          this.lastExchangeExpenseCurrencyLoaded = true;
          this._isLoaded();
        })

        this.settingService.findByName(this.lastExchangeIncomeCurrencySettingName).subscribe(setting => {
          if (setting?.value) {
            this.selectedIncomeCurrency = userCurrencies.filter(currency => currency.code == setting.value.toUpperCase())[0];
          } else {
            this.selectedIncomeCurrency = userCurrencies[0];
          }
          this.lastExchangeIncomeCurrencyLoaded = true;
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

        this.settingService.findByName(this.lastExchangeAccountIdSettingName).subscribe(setting => {
          if (setting?.value) {
            this.selectedExchangeAccountName = userAccounts.filter(account => account.id == Number.parseInt(setting.value))[0].name;
          } else {
            this.selectedExchangeAccountName = userAccounts[0].name;
          }
          this.lastExchangeAccountLoaded = true;
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
    this.exchangeInputForm.patchValue({
      expenseCurrencyCode: this.selectedExpenseCurrency.code,
    });
    this.exchangeInputForm.patchValue({
      incomeCurrencyCode: this.selectedIncomeCurrency.code,
    });
    this.exchangeInputForm.patchValue({
      accountName: this.selectedExchangeAccountName,
    });
    const result = this.userCurrenciesLoaded && this.userAccountsLoaded &&
      this.lastExchangeExpenseCurrencyLoaded && this.lastExchangeIncomeCurrencyLoaded &&
      this.lastExchangeAccountLoaded;
    this.loadedEvent.emit(result);
  }

  exchangeSave() {
    this.saveButtonDisabled = true;
    let formValue = this.exchangeInputForm.value;
    formValue.date = this.dateService.computeDateAndTime(formValue);
    const exchange: ExchangeCreate = <ExchangeCreate>formValue;
    exchange.expenseAccountId = this._computeAccountId(formValue.accountName, formValue.expenseCurrencyCode);
    exchange.incomeAccountId = this._computeAccountId(formValue.accountName, formValue.incomeCurrencyCode);
    exchange.expenseAmount = exchange.expenseAmount.trim();
    exchange.incomeAmount = exchange.incomeAmount.trim();
    this.exchangeService.exchange(exchange).subscribe({
      next: value => {
        this._saveOperationDefaults(formValue.expenseCurrencyCode, formValue.incomeCurrencyCode, exchange.expenseAccountId);
      }, complete: () => {
        this._afterOperationCreate();
      }, error: err => {
        this._afterOperationCreate();
      }
    });
  }

  private _computeAccountId(accountName: string, currencyCode: string): number {
    let accountId: number;
    accountId = this._accountsMap.get(this.accountService.accountsHashCode2(accountName, currencyCode)) ?? 0;
    return accountId;
  }

  private _saveOperationDefaults(expenseCurrencyCode: string, incomeCurrencyCode: string, exchangeAccountId: number) {
    this.settingService.save({name: this.lastExchangeExpenseCurrencySettingName, value: expenseCurrencyCode})
      .subscribe(() => {
      });

    this.settingService.save({name: this.lastExchangeIncomeCurrencySettingName, value: incomeCurrencyCode})
      .subscribe(() => {
      });

    this.settingService.save({name: this.lastExchangeAccountIdSettingName, value: exchangeAccountId.toString()})
      .subscribe(() => {
      });
  }

  private _afterOperationCreate() {
    this.saveButtonDisabled = false;
    this.subscription?.unsubscribe();
    this.exchangeService.dailyExchangesUpdate(moment().format());
  }

  controlHasError(controlName: string, errorName: string) {
    return this.exchangeInputForm.get(controlName)?.getError(errorName);
  }

  controlIsInvalid(controlName: string): boolean {
    let abstractControl = this.exchangeInputForm.get(controlName);
    return (abstractControl?.invalid && (abstractControl?.dirty || abstractControl?.touched)) ?? false
  }

}
