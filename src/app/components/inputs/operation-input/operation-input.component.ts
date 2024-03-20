import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Currency} from "../../../interfaces/Currency";
import {CurrencyService} from "../../../service/currency.service";
import {map, Observable, Subscription, tap} from "rxjs";
import {Category} from "../../../interfaces/Category";
import {CategoryService} from "../../../service/category.service";
import {AccountService} from "../../../service/account.service";
import {OperationTypeEnum} from "../../../enums/OperationTypeEnum";
import {SettingService} from "../../../service/setting.service";
import {environment} from "../../../../environments/environment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OperationCreate} from "../../../interfaces/OperationCreate";
import {OperationService} from "../../../service/operation.service";
import {DateService} from "../../../service/date.service";
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {amountCorrectValueValidator, amountPositiveOrZeroValueValidator} from "../../shared/validators/amount.validators";

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

  userAccountNames: string[] = [];
  userAccountsLoaded: boolean = false;
  selectedAccountName: string = "";

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

  /**
   * Мапа для поиска идентификатора счёта по его имени и буквенному коду валюты
   * @private
   */
  private _accountsMap: Map<string, number> = new Map<string, number>();

  constructor(private currencyService: CurrencyService,
              private categoryService: CategoryService,
              private accountService: AccountService,
              private settingService: SettingService,
              private operationService: OperationService,
              private fb: FormBuilder,
              private dateService: DateService) {
    this.operationInputForm = this.fb.group({
      amount: ["0", [Validators.required, amountCorrectValueValidator(), amountPositiveOrZeroValueValidator()]],
      currencyCode: [""],
      accountName: [""],
      categoryId: ["0"],
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

    //Категории
    this._loadCategories();

    //Счета
    this._loadAccounts();
  }

  operationInputSave() {
    this.saveButtonDisabled = true;
    let value = this.operationInputForm.value;
    value.date = this.dateService.computeDateAndTime(value);
    value.accountId = this._computeAccountId(this.operationInputForm.getRawValue());
    const operation: OperationCreate = <OperationCreate>value;
    operation.amount = operation.amount.trim();
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
        this.lastCurrencySettingName = environment.constants.last_expense_currency;
        this.lastAccountSettingName = environment.constants.last_expense_account_id;
        this.lastCategorySettingName = environment.constants.last_expense_category_id;
        break;
      case OperationTypeEnum.INCOME:
        this.lastCurrencySettingName = environment.constants.last_income_currency;
        this.lastAccountSettingName = environment.constants.last_income_account_id;
        this.lastCategorySettingName = environment.constants.last_income_category_id;
        break;
      default:
        throw new Error("Incorrect operation type. Must be OperationTypeEnum.EXPENSE or OperationTypeEnum.INCOME");
    }
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

        this.settingService.findByName(this.lastAccountSettingName).subscribe(setting => {
          if (setting?.value) {
            this.selectedAccountName = userAccounts.filter(account => account.id == Number.parseInt(setting.value))[0].name;
          } else {
            this.selectedAccountName = userAccounts[0].name;
          }
          this.lastAccountLoaded = true;
          this._isLoaded();
        })
      })
    ).subscribe({
      complete: () => {
        subscription1?.unsubscribe();
      }
    });
  }

  private _computeAccountId(value: { accountName: string, currencyCode: string }): number {
    let accountId: number = 0;
    accountId = this._accountsMap.get(this.accountService.accountsHashCode2(value.accountName, value.currencyCode)) ?? 0;
    return accountId;
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

  private _isLoaded(): void {
    this.operationInputForm.patchValue({
      currencyCode: this.selectedCurrency.code,
    });
    this.operationInputForm.patchValue({
      categoryId: this.selectedCategory.id,
    });
    this.operationInputForm.patchValue({
      accountName: this.selectedAccountName
    });
    const result = this.userCategoriesLoaded && this.userCurrenciesLoaded && this.userAccountsLoaded &&
    this.lastCategoryLoaded && this.lastCurrencyLoaded && this.lastAccountLoaded;
    this.loadedEvent.emit(result);
  }

  controlHasError(controlName: string, errorName: string) {
    return this.operationInputForm.get(controlName)?.getError(errorName);
  }

  controlIsInvalid(controlName: string): boolean {
    let abstractControl = this.operationInputForm.get(controlName);
    return (abstractControl?.invalid && (abstractControl?.dirty || abstractControl?.touched)) ?? false
  }
}
