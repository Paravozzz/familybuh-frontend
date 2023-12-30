import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Currency} from "../../interfaces/Currency";
import {CurrencyService} from "../../service/currency.service";
import {map, Observable, Subscription, tap} from "rxjs";
import {Category} from "../../interfaces/Category";
import {CategoryService} from "../../service/category.service";
import {Account} from "../../interfaces/Account";
import {AccountService} from "../../service/account.service";
import {OperationTypeEnum} from "../../enums/OperationTypeEnum";
import {SettingService} from "../../service/setting.service";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OperationCreate} from "../../interfaces/OperationCreate";
import {OperationService} from "../../service/operation.service";
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {NgbCalendar, NgbDateAdapter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-operation-input',
  templateUrl: './operation-input.component.html',
  styleUrls: ['./operation-input.component.css']
})
export class OperationInputComponent implements OnInit {

  @Input("operationType") operationType!: OperationTypeEnum;
  @Output("loaded") loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public operationInputForm: FormGroup;

  userCurrencies!: Observable<Currency[]>;
  userCurrenciesLoaded: boolean = false;
  selectedCurrency: Currency = <Currency>{code: "000"};

  userCategories!: Observable<Category[]>;
  userCategoriesLoaded: boolean = false;
  selectedCategory: Category = <Category>{id: 0};

  userAccounts!: Observable<Account[]>;
  userAccountsLoaded: boolean = false;
  selectedAccount: Account = <Account>{id: 0};

  saveButtonDisabled: boolean = false;

  lastCurrencySettingName!: string;
  lastCurrencyLoaded: boolean = false;

  lastCategorySettingName!: string;
  lastCategoryLoaded: boolean = false;

  lastAccountSettingName!: string;
  lastAccountLoaded: boolean = false;

  hours: number[];
  minutes: number[];

  subscription?: Subscription;

  model!: NgbDateStruct;

  constructor(private currencyService: CurrencyService,
              private categoryService: CategoryService,
              private accountService: AccountService,
              private settingService: SettingService,
              private operationService: OperationService,
              private fb: FormBuilder,
              private ngbCalendar: NgbCalendar,
              private dateAdapter: NgbDateAdapter<string>) {
    this.operationInputForm = this.fb.group({
      amount: "0",
      currencyCode: "",
      accountId: "0",
      categoryId: "0",
      description: "",
      date: this.today,
      hour: "",
      minute: ""
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

    //Категории
    this._loadCategories();

    //Счета
    this._loadAccounts();
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  private _loadAccounts() {
    this.userAccounts = this.accountService.getUsersAccounts().pipe(
      tap(userAccounts => {
        this.userAccountsLoaded = true;
        this._isLoaded();

        this.settingService.findByName(this.lastAccountSettingName).subscribe(setting => {
          if (setting?.value) {
            this.selectedAccount = userAccounts.filter(account => account.id == Number.parseInt(setting.value))[0];
          } else {
            this.selectedAccount = userAccounts[0];
          }
          this.lastAccountLoaded = true;
          this._isLoaded();
        })
      })
    );
  }

  private _loadCategories() {
    this.userCategories = this.categoryService.getUsersCategories().pipe(
      map(userCategories => userCategories.filter(category => category.isIncome === (this.operationType == OperationTypeEnum.INCOME))),
      tap(userCategories => {
        this.userCategoriesLoaded = true;
        this._isLoaded();

        this.settingService.findByName(this.lastCategorySettingName).subscribe(setting => {
          if (setting?.value) {
            this.selectedCategory = userCategories.filter(category => category.id == Number.parseInt(setting.value))[0];
          } else {
            this.selectedCategory = userCategories[0];
          }
          this.lastCategoryLoaded = true;
          this._isLoaded();

        })
      })
    );
  }

  private _loadCurrencies() {
    this.userCurrencies = this.currencyService.getUsersCurrencies().pipe(
      tap(userCurrencies => {
        this.userCurrenciesLoaded = true;
        this._isLoaded();

        this.settingService.findByName(this.lastCurrencySettingName).subscribe(setting => {
            if (setting?.value) {
              this.selectedCurrency = userCurrencies.filter(currency => currency.code == setting.value.toUpperCase())[0];
            } else {
              this.selectedCurrency = userCurrencies[0];
            }
            this.lastCurrencyLoaded = true;
            this._isLoaded();
        })
      })
    );
  }

  private _initConstants() {
    switch (this.operationType) {
      case OperationTypeEnum.EXPENSE:
        this.lastCurrencySettingName = environment.constants.last_exp_currency;
        this.lastAccountSettingName = environment.constants.last_exp_account;
        this.lastCategorySettingName = environment.constants.last_exp_category;
        break;
      case OperationTypeEnum.INCOME:
        this.lastCurrencySettingName = environment.constants.last_inc_currency;
        this.lastAccountSettingName = environment.constants.last_inc_account;
        this.lastCategorySettingName = environment.constants.last_inc_category;
        break;
      default:
        throw new Error("Incorrect operation type. Must be OperationTypeEnum.EXPENSE or OperationTypeEnum.INCOME");
    }
  }

  private _isLoaded(): void {
    this.operationInputForm.patchValue({
      currencyCode: this.selectedCurrency.code,
    });
    this.operationInputForm.patchValue({
      categoryId: this.selectedCategory.id,
    });
    this.operationInputForm.patchValue({
      accountId: this.selectedAccount.id
    });
    const result = this.userCategoriesLoaded && this.userCurrenciesLoaded && this.userAccountsLoaded &&
    this.lastCategoryLoaded && this.lastCurrencyLoaded && this.lastAccountLoaded;
    this.loadedEvent.emit(result);
  }

  operationInputSave() {
    this.saveButtonDisabled = true;
    let value = this.operationInputForm.value;
    value.date = this._computeDateAndTime(value);

    const operation: OperationCreate = <OperationCreate>value;
    switch (this.operationType) {
      case OperationTypeEnum.EXPENSE:
        this._createExpense(operation);
        break;
      case OperationTypeEnum.INCOME:
        this._createIncome(operation);
        break;
      default:
        throw new Error("Incorrect operation type. Must be OperationTypeEnum.EXPENSE or OperationTypeEnum.INCOME");
    }
  }

  /**
   * Если пользователем заданы ЧЧ и ММ, то берём пользовательское время, если нет, то текущее.
   * @param value
   * @private
   */
  private _computeDateAndTime(value: any): string {
    let dateAndTime: _moment.Moment = moment();
    try {
      dateAndTime = moment(value.date.year+"-"+value.date.month+"-"+value.date.day); //пользовательская дата с формы
    } catch {
      //do nothing
      console.log(dateAndTime);
    }
    //по-умолчанию текущее время
    let time = moment();
    let hh: number = time.hour();
    let mm: number = time.minute();
    let userTime: boolean = false;
    //пробуем распарсить пользовательское время
    try {
      if (value?.hour && value?.minute) {
        let hh_value = Number.parseInt(value.hour);
        let mm_value = Number.parseInt(value.minute);
        if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
          hh = hh_value;
          mm = mm_value;
          userTime = true;
        }
      }
    } catch {
      //do nothing
    }
    dateAndTime.hour(hh);
    dateAndTime.minute(mm);
    if (userTime) { //если было установлено пользовательское время
      dateAndTime.second(0);
      dateAndTime.millisecond(0);
    } else {
      dateAndTime.second(time.second());
      dateAndTime.millisecond(time.millisecond());
    }

    return dateAndTime.format();
  }

  private _createExpense(operation: OperationCreate) {
    this.subscription = this.operationService.expense(operation).subscribe({
      next: value => {
        this._saveOperationDefaults(operation.currencyCode, operation.accountId, operation.categoryId)
      }, complete: () => {
        this._afterOperationCreate();
      }, error: err => {
        this._afterOperationCreate();
      }
    });
  }

  private _afterOperationCreate() {
    this.saveButtonDisabled = false;
    this.subscription?.unsubscribe();
    this.operationService.dailyOperationsUpdate(this.operationType, moment().format());
  }

  private _createIncome(operation: OperationCreate) {
    this.subscription = this.operationService.income(operation).subscribe({
      next: value => {
        this._saveOperationDefaults(operation.currencyCode, operation.accountId, operation.categoryId);
      }, complete: () => {
        this._afterOperationCreate();
      }, error: err => {
        this._afterOperationCreate();
      }
    });
  }

  private _saveOperationDefaults(currencyCode: string, accountId: number, categoryId: number) {
    this.settingService.save({name: this.lastCurrencySettingName, value: currencyCode})
      .subscribe(() => {
      });

    this.settingService.save({name: this.lastCategorySettingName, value: categoryId.toString()})
      .subscribe(() => {
      });

    this.settingService.save({name: this.lastAccountSettingName, value: accountId.toString()})
      .subscribe(() => {
      });
  }
}
