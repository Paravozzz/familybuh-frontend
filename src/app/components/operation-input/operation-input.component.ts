import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Currency} from "../../interfaces/Currency";
import {CurrencyService} from "../../service/currency.service";
import {map, Observable, tap} from "rxjs";
import {Category} from "../../interfaces/Category";
import {CategoryService} from "../../service/category.service";
import {Account} from "../../interfaces/Account";
import {AccountService} from "../../service/account.service";
import {OperationTypeEnum} from "../../enums/OperationTypeEnum";
import {SettingService} from "../../service/setting.service";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormGroup} from "@angular/forms";

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

  constructor(private currencyService: CurrencyService,
              private categoryService: CategoryService,
              private accountService: AccountService,
              private settingService: SettingService,
              private fb: FormBuilder) {
    this.operationInputForm = this.fb.group({
      amount: "0",
      currencyCode: "",
      accountId: "0",
      categoryId: "0",
      description: ""
    });
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
    if (this.operationType === OperationTypeEnum.EXPENSE) {
      this.lastCurrencySettingName = environment.constants.last_exp_currency;
      this.lastAccountSettingName = environment.constants.last_exp_account;
      this.lastCategorySettingName = environment.constants.last_exp_category;
    } else {
      this.lastCurrencySettingName = environment.constants.last_inc_currency;
      this.lastAccountSettingName = environment.constants.last_inc_account;
      this.lastCategorySettingName = environment.constants.last_inc_category;
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
    const result = this.userCategoriesLoaded && this.userCurrenciesLoaded && this.userAccountsLoaded;
    this.loadedEvent.emit(result);
  }

  operationInputSave() {
    this.saveButtonDisabled = true;
    this.settingService.save({name: this.lastCurrencySettingName, value: "RUB"})
      .subscribe(() => {
      });

    this.saveButtonDisabled = false;
  }
}
