import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Currency} from "../../interfaces/Currency";
import {CurrencyService} from "../../service/currency.service";
import {map, Observable, tap} from "rxjs";
import {Category} from "../../interfaces/Category";
import {CategoryService} from "../../service/category.service";
import {Account} from "../../interfaces/Account";
import {AccountService} from "../../service/account.service";
import {OperationTypeEnum} from "../../enums/OperationTypeEnum";

@Component({
  selector: 'app-operation-input',
  templateUrl: './operation-input.component.html',
  styleUrls: ['./operation-input.component.css']
})
export class OperationInputComponent implements OnInit {

  @Input("operationType") operationType!: OperationTypeEnum;
  @Output("loaded") loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  userCurrencies!: Observable<Currency[]>;
  userCurrenciesLoaded: boolean = false;
  userCategories!: Observable<Category[]>;
  userCategoriesLoaded: boolean = false;
  userAccounts!: Observable<Account[]>;
  userAccountsLoaded: boolean = false;

  constructor(private currencyService: CurrencyService,
              private categoryService: CategoryService,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.userCurrencies = this.currencyService.getUsersCurrencies().pipe(
      tap(value => {
        this.userCurrenciesLoaded = true;
        this._isLoaded();
      })
    );
    this.userCategories = this.categoryService.getUsersCategories().pipe(
      map(items => items.filter(item => item.isIncome === (this.operationType == OperationTypeEnum.INCOME))),
      tap(value => {
        this.userCategoriesLoaded = true;
        this._isLoaded();
      })
    );
    this.userAccounts = this.accountService.getUsersAccounts().pipe(
      tap(value => {
        this.userAccountsLoaded = true;
        this._isLoaded();
      })
    );
  }

  private _isLoaded(): void {
    const result = this.userCategoriesLoaded && this.userCurrenciesLoaded && this.userAccountsLoaded;
    this.loadedEvent.emit(result);
  }

}
