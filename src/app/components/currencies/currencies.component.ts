import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Currency} from "src/app/interfaces/Currency";
import {HttpClient} from "@angular/common/http";
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent} from "@angular/material/chips";

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements AfterViewInit {
  separatorKeysCodes: number[] = [ENTER];
  currenciesCtrl = new FormControl('');
  filteredCurrencies!: Observable<Currency[]>;
  selectedCurrencies: Currency[] = [];
  allCurrencies: Currency[] | null = null;
  userCurrencies: Currency[] | null = null;
  @ViewChild('currencyInput') currencyInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) {

  }

  ngAfterViewInit(): void {
    this.http.get<Currency[]>("/api/currencies", {withCredentials: true})
      .subscribe({
        next: currencies => {
          this.allCurrencies = currencies;
          if (!this.allCurrencies)
            this.allCurrencies = [];
          this.filteredCurrencies = this._updateFiltered();
        },
        error: err => {
          console.error(err);
        },
        complete: () => {

        }
      });

    this.http.get<Currency[]>("/api/user/currencies", {withCredentials: true})
      .subscribe({
        next: currencies => {
          if (currencies) {
            this.selectedCurrencies.push(...currencies);
            this.userCurrencies = currencies;
          }
          else {
            console.error("Error while fetching userCurrencies (null)!");
          }
        },
        error: err => {
          console.error(err);
        },
        complete: () => {

        }
      })
  }

  add(event: MatChipInputEvent): void {
    const value = event.value;

    // Add our currency if we find one
    if (value) {
      const matchCurrencies: Currency[] = this.allCurrencies!.filter(currency => this._filterCurrencyByStringValue(currency, value));
      if (matchCurrencies.length == 1) {
        const selectedCurrency: Currency = matchCurrencies[0];
        if (selectedCurrency)
          this._removeFromAllCurrenciesAndAddToSelected(selectedCurrency);
      }
    }

    // Clear the input value
    event.chipInput.clear();

    this.currenciesCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedCurrency = event.option.value;
    this._removeFromAllCurrenciesAndAddToSelected(selectedCurrency)
    this.currencyInput.nativeElement.value = '';
    this.currenciesCtrl.setValue(null);
  }

  removeFromSelected(currency: Currency): void {
    this._removeFromSelectedAndAddToAllCurrencies(currency);
  }

  private _updateFiltered(): Observable<Currency[]> {
    return this.currenciesCtrl.valueChanges.pipe(
      startWith(null),
      map((currency: string | null) => (currency ? this._filter(currency) : this.allCurrencies!.slice())),
    );
  }

  private _removeFromSelectedAndAddToAllCurrencies(currency: Currency) {
    const index = this.selectedCurrencies.indexOf(currency);
    if (index >= 0) {
      this.selectedCurrencies.splice(index, 1);
      if (this.allCurrencies!.indexOf(currency) < 0) {
        this.allCurrencies!.push(currency);
        this.allCurrencies!.sort((a, b) => this._sortCurrencyById(a, b))
      }
      this.filteredCurrencies = this._updateFiltered();
    }
  }

  private _removeFromAllCurrenciesAndAddToSelected(currency: Currency) {

    this.http.post<Currency>("/api/user/currency/" + currency.code, {}, {withCredentials: true})
      .subscribe({
        next: currency => {
          const index = this.allCurrencies!.indexOf(currency);
          if (index >= 0) {
            if (this.selectedCurrencies.indexOf(currency) < 0) {
              this.selectedCurrencies.push(currency);
            }
            this.allCurrencies!.splice(index, 1);
            this.filteredCurrencies = this._updateFiltered();
          }
        },
        error: err => {
          console.error(err);
        },
        complete: () => {

        }
      });
  }

  private _sortCurrencyById(a: Currency, b: Currency): number {
    if (a.id === b.id) return 0;
    return Number.parseInt(a.id) - Number.parseInt(b.id);
  }

  private _filter(value: string): Currency[] {
    value = value.toLowerCase();
    return this.allCurrencies!.filter(currency => this._filterCurrencyByStringValue(currency, value));
  }

  private _filterCurrencyByStringValue(currency: Currency, value: string) {
    return currency.code.toLowerCase().includes(value) || currency.name.toLowerCase().includes(value);
  }
}
