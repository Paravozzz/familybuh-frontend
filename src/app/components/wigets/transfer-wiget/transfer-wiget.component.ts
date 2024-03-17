import {Component, OnInit} from '@angular/core';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {TransferService} from "../../../service/transfer.service";
import {Observable} from "rxjs";
import {TransferDto} from "../../../interfaces/TransferDto";

const moment = _rollupMoment || _moment;


@Component({
  selector: 'app-transfer-wiget',
  templateUrl: './transfer-wiget.component.html',
  styleUrls: ['./transfer-wiget.component.css']
})
export class TransferWigetComponent implements OnInit {

  dailyTransfers: Observable<TransferDto[]>;
  dailyTransfersSummary: {currencyCode:string, summ:string}[] = [];
  reportDate = moment();

  constructor(private transferService: TransferService) {
    this.dailyTransfers = this.transferService.dailyTransfers;
    const summaryMap: Map<string, number> = new Map<string, number>();
    this.dailyTransfers.subscribe(transfers => {
      summaryMap.clear();
      this.dailyTransfersSummary = [];
      if (!transfers || transfers.length == 0) {
        return;
      }
      transfers.forEach(transfer => {
        const currencyCode = transfer.currencyCode;
        let summ = summaryMap.get(currencyCode) ?? 0;
        summ += Number.parseFloat(transfer.amount);
        summaryMap.set(currencyCode, summ);
      });

      for (const entry of summaryMap.entries()) {
        this.dailyTransfersSummary.push({currencyCode: entry[0], summ: entry[1].toString()})
      }
    });
  }

  ngOnInit(): void {
    this.transferService.dailyTransfersUpdate(moment().format());
  }

  formatTime(date: string): string {
    return moment(date).format('HH:mm');
  }

  decreaseDate() {
    this.reportDate = this.reportDate.subtract(1, 'days');
    this.transferService.dailyTransfersUpdate(this.reportDate.format())
  }

  increaseDate() {
    this.reportDate = this.reportDate.add(1, 'days');
    this.transferService.dailyTransfersUpdate(this.reportDate.format())
  }

  get isToday(): boolean {
    return this.reportDate.format("DD-MM-yyyy") === moment().format("DD-MM-yyyy");
  }

  get isYesterday(): boolean {
    return this.reportDate.format("DD-MM-yyyy") === moment().subtract(1, 'days').format("DD-MM-yyyy");
  }
}
