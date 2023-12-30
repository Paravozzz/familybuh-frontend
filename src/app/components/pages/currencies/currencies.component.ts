import {Component, OnInit} from '@angular/core';
import {Currency} from "src/app/interfaces/Currency";
import {CurrencyService} from "../../../service/currency.service";

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
  readonly CLICK_TO_SELECT_CURRENCY = 'Нажмите для выбора валюты';
  /**
   * Справочник валют
   */
  allCurrencies: Currency[] = [];
  allCurrenciesLoaded: boolean = false;
  /**
   * Пользовательские валюты
   */
  userCurrencies: string[] = [];
  userCurrenciesLoaded: boolean = false;
  /**
   * Отфильтрованные валюты отображаемые в списке для выбора
   */
  filteredCurrencies!: string[];
  selectedCurrencyFullName: string = '';
  addButtonDisabled: boolean = true;

  constructor(protected currencyService: CurrencyService) {
  }

  ngOnInit(): void {
    this.currencyService.getAll()
      .subscribe({
        next: value => {
          if (value && Array.isArray(value)) {
            value = value.sort(this._currencySortFn());
            this.allCurrencies.push(...value);
            this.allCurrenciesLoaded = true;
            this._refreshFilteredCurrencies();
          } else {
            console.error("Не удалось загрузить справочник валют!");
          }
        },
        error: err => {
          console.error(err);
        }
      });

    this.currencyService.getUsersCurrencies()
      .subscribe({
        next: value => {
          if (value && Array.isArray(value)) {
            value = value.sort(this._currencySortFn());
            this.userCurrencies.push(...value.map(currency => this.currencyService.getFullName(currency)));
            this.userCurrenciesLoaded = true;
            this._refreshFilteredCurrencies();
          }
        }, error: err => {
          console.error(err);
        }
      })

  }

  /**
   * Добавление валюты.
   */
  add(): void {
    this.addButtonDisabled = true;
    if (this.selectedCurrencyFullName) {
      const filteredCurrencies = this._filter(this.selectedCurrencyFullName);
      if (filteredCurrencies.length == 1) {
        this._attachCurrencyToUser(filteredCurrencies[0]);
      } else {
        this.addButtonDisabled = false;
        return;
      }
    }
  }

  onCurrencySelected($event: Event) {
    const target = <HTMLSelectElement>$event.target;
    this.selectedCurrencyFullName = target.value;
    this.addButtonDisabled = this.selectedCurrencyFullName === this.CLICK_TO_SELECT_CURRENCY;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCurrencies
      .map(currency => this.currencyService.getFullName(currency))
      .filter(currency => !this.userCurrencies.includes(currency))
      .filter(currency => currency.toLowerCase().includes(filterValue));
  }

  private _attachCurrencyToUser(currencyFullName: string) {
    const currencyCode: string = this.currencyService.getCodeFromFullName(currencyFullName);
    return this.currencyService.attachCurrencyToUser(currencyCode)
      .subscribe({
        next: value => {
          if (value) {
            this.userCurrencies.push(currencyFullName);
            this._refreshFilteredCurrencies();
          }
        },
        error: err => {
          this.addButtonDisabled = false;
          console.error(err);
        }
      })
  }

  private _refreshFilteredCurrencies(): void {
    //Если нет общего списка валют, то и в селекторе валют тоже ничего не отображаем
    if (!this.allCurrenciesLoaded || !this.allCurrencies || this.allCurrencies.length === 0) {
      this.filteredCurrencies = [];
      return;
    }

    //Если нет выбранных пользовательских валют, то в селекторе валют показываем все валюты из общего списка
    if (!this.userCurrenciesLoaded || !this.userCurrencies || this.userCurrencies.length === 0) {
      this.filteredCurrencies = this.allCurrencies.map(currency => this.currencyService.getFullName(currency));
      return;
    }

    const userCodesArray: string[] = this.userCurrencies.map(value => this.currencyService.getCodeFromFullName(value));
    const userCodesSet: Set<string> = new Set(userCodesArray);
    this.filteredCurrencies = this.allCurrencies
      .filter(currency => !userCodesSet.has(currency.code))
      .sort(this._currencySortFn())
      .map(currency => this.currencyService.getFullName(currency))
  }

  private _currencySortFn() {
    return (a: Currency, b: Currency) => ('' + this.currencyService.getFullName(a)).localeCompare(this.currencyService.getFullName(b));
  }
}
