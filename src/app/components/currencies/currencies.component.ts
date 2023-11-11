import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Currency} from "src/app/interfaces/Currency";
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent} from "@angular/material/chips";
import {CurrencyService} from "../../service/currency.service";

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
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
   * Отфильтрованные валюты при автозаполнении
   */
  filteredCurrencies!: Observable<string[]>;

  separatorKeysCodes: number[] = [ENTER];
  currencyCtrl = new FormControl('');

  @ViewChild('currencyInput') currencyInput!: ElementRef<HTMLInputElement>;

  constructor(protected currencyService: CurrencyService) {
    this.filteredCurrencies = this.currencyCtrl.valueChanges.pipe(
      startWith(null),
      map((currency: string | null) => (currency ? this._filter(currency) : this.allCurrencies.map(currency => this.currencyService.getFullName(currency)).filter(currency => !this.userCurrencies.includes(currency)).slice())),
    );
  }

  ngOnInit(): void {
    this.currencyService.getAll()
      .subscribe({
        next: value => {
          if (value && Array.isArray(value)) {
            value = value.sort((a, b) => ('' + this.currencyService.getFullName(a)).localeCompare(this.currencyService.getFullName(b)));
            this.allCurrencies.push(...value);
            this.allCurrenciesLoaded = true;
          } else {
            console.error("Не удалось загрузить справочник валют!");
          }
        },
        error: err => {
          console.error(err);
        },
        complete: () => {
          this.currencyCtrl.setValue(null);
        }
      });

    this.currencyService.getUsersCurrencies()
      .subscribe({
        next: value => {
          if (value && Array.isArray(value)) {
            value = value.sort((a, b) => ('' + this.currencyService.getFullName(a)).localeCompare(this.currencyService.getFullName(b)));
            this.userCurrencies.push(...value.map(currency => this.currencyService.getFullName(currency)));
            this.userCurrenciesLoaded = true;
          }
        }, error: err => {
          console.error(err);
        },
        complete: () => {
          this.currencyCtrl.setValue(null);
        }
      })

  }

  /**
   * Добавление в поле еще одного Chip
   * @param event
   */
  add(event: MatChipInputEvent): void {
    console.log("add");
    const value = (event.value || '').trim();

    if (value) {
      const filteredCurrencies = this._filter(value);
      if (filteredCurrencies.length == 1) {
        this.userCurrencies.push(filteredCurrencies[0]);
      } else {
        return;
      }
    }

    // Clear the input value
    event.chipInput!.clear();

    this.currencyCtrl.setValue(null);
  }

  remove(currency: string): void {
    console.warn("Удаление пользовательской валюты недоступно!");
    return;
    const index = this.userCurrencies.indexOf(currency);

    if (index >= 0) {
      this.userCurrencies.splice(index, 1);
      this.currencyCtrl.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log("selected");
    this.userCurrencies.push(event.option.viewValue);
    this.currencyInput.nativeElement.value = '';
    this.currencyCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCurrencies
      .map(currency => this.currencyService.getFullName(currency))
      .filter(currency => !this.userCurrencies.includes(currency))
      .filter(currency => currency.toLowerCase().includes(filterValue));
  }

}
