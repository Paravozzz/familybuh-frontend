import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Currency} from "../../../interfaces/Currency";
import {MatSelectChange} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {InitService} from "../../../service/init.service";
import {CurrencyService} from "../../../service/currency.service";

export interface InitDialogData {
  currencyCode: string
}

@Component({
  selector: 'app-init-dialog',
  templateUrl: './init-dialog.component.html',
  styleUrls: ['./init-dialog.component.css']
})
export class InitDialogComponent implements OnInit {
  @ViewChild("okButton") okButton!: ElementRef<HTMLInputElement>;
  currencies: Currency[] = [];
  okButtonDisabled: boolean = true;

  constructor(public dialogRef: MatDialogRef<InitDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: InitDialogData,
              private http: HttpClient,
              private initService: InitService,
              private currencyService: CurrencyService
  ) {
  }

  ngOnInit(): void {
    //Загружаем справочник валют
    this.currencyService.getAll()
      .subscribe({
        next: currencies => {
          if (currencies) {
            this.currencies = currencies;
            this.currencies = currencies.sort((a, b) => this._sortCurrencyByName(a, b));
          } else {
            console.error("Error while fetching userCurrencies (null)!");
          }
        },
        error: err => {
          console.error(err);
        }
      });
  }

  okClick(selected: MatOption | MatOption[]) {
    if (!selected) {
      return;
    }

    if (Array.isArray(selected)) {
      console.error("Одновременный выбор нескольких валют недопустим.")
      return;
    }

    const currencyCode: string = selected.value;
    this.okButtonDisabled = true;
    this.initService.init(currencyCode).subscribe({
      next: isInit => {
        if (isInit) {
          this.dialogRef.close(isInit);
        }
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.okButtonDisabled = false;
      }
    });
  }

  currencyValue(currency: Currency) {
    return currency.name + ' (' + currency.code + ')';
  }

  private _sortCurrencyByName(a: Currency, b: Currency): number {
    return ('' + a.name).localeCompare(b.name);
  }

  onSelect(event: MatSelectChange) {
    this.okButtonDisabled = !event.value;
  }
}
