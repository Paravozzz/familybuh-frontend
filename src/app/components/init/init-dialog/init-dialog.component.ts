import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Currency} from "../../../interfaces/Currency";
import {InitService} from "../../../service/init.service";
import {CurrencyService} from "../../../service/currency.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-init-dialog',
  templateUrl: './init-dialog.component.html',
  styleUrls: ['./init-dialog.component.css']
})
export class InitDialogComponent implements OnInit {
  @ViewChild("okButton") okButton!: ElementRef<HTMLInputElement>;
  @ViewChild('currencySelector') currencySelector!: ElementRef<HTMLInputElement>;
  currencies: Currency[] = [];
  okButtonDisabled: boolean = false;

  constructor(private http: HttpClient,
              private initService: InitService,
              private currencyService: CurrencyService,
              public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
    //Загружаем справочник валют
    this.currencyService.getAll()
      .subscribe({
        next: currencies => {
          if (currencies) {
            this.currencies = currencies;
            this.currencies.sort((a, b) => this._sortCurrencyByName(a, b));
          } else {
            console.error("Error while fetching userCurrencies (null)!");
          }
        },
        error: err => {
          console.error(err);
        }
      });
  }

  okClick(currencyCode: string) {
    this.okButtonDisabled = true;
    if (!currencyCode) {
      this.okButtonDisabled = false;
      return;
    }

    if (Array.isArray(currencyCode)) {
      this.okButtonDisabled = false;
      console.error("Одновременный выбор нескольких валют недопустим.")
      return;
    }

    this.initService.init(currencyCode).subscribe({
      next: isInit => {
        if (isInit) {
          this.activeModal.close(isInit);
        }
      },
      error: err => {
        this.okButtonDisabled = false;
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

}
