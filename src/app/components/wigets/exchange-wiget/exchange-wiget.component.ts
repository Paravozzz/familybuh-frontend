import { Component } from '@angular/core';
import {ExchangeService} from "../../../service/exchange.service";

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {Observable} from "rxjs";
import {ExchangeDto} from "../../../interfaces/ExchangeDto";
import {Currency} from "../../../interfaces/Currency";
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-exchange-wiget',
  templateUrl: './exchange-wiget.component.html',
  styleUrls: ['./exchange-wiget.component.css']
})
export class ExchangeWigetComponent {

  dailyExchanges: Observable<ExchangeDto[]>;
  dailyExchangesSummary: {isExpense: boolean, currency:Currency, summ:string}[] = [];
  reportDate = moment();

  constructor(private exchangeService: ExchangeService) {
    this.dailyExchanges = exchangeService.dailyExchanges;
    const summaryMap: Map<Currency, {expense:number, income:number}> = new Map<Currency, {expense:number, income:number}>();
    this.dailyExchanges.subscribe(exchanges => {
      summaryMap.clear();
      this.dailyExchangesSummary = [];
      if (!exchanges || exchanges.length == 0) {
        return;
      }
      exchanges.forEach(exchange => {
        const expenseCurrency = exchange.expenseCurrency;
        const incomeCurrency = exchange.incomeCurrency;

        let expenseSumm = summaryMap.get(expenseCurrency) ?? {expense:0, income:0};
        expenseSumm.expense += Number.parseFloat(exchange.expenseAmount);
        summaryMap.set(expenseCurrency, expenseSumm);

        let incomeSumm = summaryMap.get(incomeCurrency) ?? {expense:0, income:0};
        incomeSumm.income += Number.parseFloat(exchange.incomeAmount);
        summaryMap.set(incomeCurrency, incomeSumm);
      });

      for (const entry of summaryMap.entries()) {
        const currencyCode = entry[0];
        const expenseSumm = entry[1].expense;
        const incomeSumm = entry[1].income;
        if (Math.abs(Math.round(expenseSumm)) !== 0) {
          this.dailyExchangesSummary.push({currency: currencyCode, isExpense: true, summ: expenseSumm.toString()})
        }
        if (Math.abs(Math.round(incomeSumm)) !== 0) {
          this.dailyExchangesSummary.push({currency: currencyCode, isExpense: false, summ: incomeSumm.toString()})
        }
      }

      let date_string = exchanges.at(0)?.date;
      if (date_string) {
        this.reportDate = moment(date_string);
      }
    });
  }

  ngOnInit(): void {
    this.exchangeService.dailyExchangesUpdate(moment().format());
  }

  formatTime(date: string): string {
    return moment(date).format('HH:mm');
  }

  decreaseDate() {
    this.reportDate = this.reportDate.subtract(1, 'days');
    this.exchangeService.dailyExchangesUpdate(this.reportDate.format())
  }

  increaseDate() {
    this.reportDate = this.reportDate.add(1, 'days');
    this.exchangeService.dailyExchangesUpdate(this.reportDate.format())
  }

  get isToday(): boolean {
    return this.reportDate.format("DD-MM-yyyy") === moment().format("DD-MM-yyyy");
  }

  get isYesterday(): boolean {
    return this.reportDate.format("DD-MM-yyyy") === moment().subtract(1, 'days').format("DD-MM-yyyy");
  }
}
