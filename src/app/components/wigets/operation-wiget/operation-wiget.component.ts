import {Component, Input, OnInit} from '@angular/core';
import {OperationService} from "../../../service/operation.service";
import {Observable} from "rxjs";
import {OperationDto} from "../../../interfaces/OperationDto";
import {OperationTypeEnum} from "../../../enums/OperationTypeEnum";
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-operation-wiget',
  templateUrl: './operation-wiget.component.html',
  styleUrls: ['./operation-wiget.component.css']
})
export class OperationWigetComponent implements OnInit {
  @Input("operationType") operationType!: OperationTypeEnum;
  eOperationType = OperationTypeEnum;
  dailyOperations: Observable<OperationDto[]>;
  dailyOperationsSummary: {currencyCode:string, summ:string}[] = [];
  reportDate = moment();

  constructor(private operationService: OperationService) {
    this.dailyOperations = this.operationService.dailyOperations;
    const summaryMap: Map<string, number> = new Map<string, number>();
    this.dailyOperations.subscribe(operations => {
      summaryMap.clear();
      this.dailyOperationsSummary = [];
      if (!operations || operations.length == 0) {
        return;
      }
      operations.forEach(operation => {
        const currencyCode = operation.currencyCode;
        let summ = summaryMap.get(currencyCode) ?? 0;
        summ += Number.parseFloat(operation.amount);
        summaryMap.set(currencyCode, summ);
      });

      for (const entry of summaryMap.entries()) {
        this.dailyOperationsSummary.push({currencyCode: entry[0], summ: entry[1].toString()})
      }
    });
  }

  ngOnInit(): void {
    this.operationService.dailyOperationsUpdate(this.operationType, moment().format());
  }

  formatTime(date: string): string {
    return moment(date).format('HH:mm');
  }

  decreaseDate() {
    this.reportDate = this.reportDate.subtract(1, 'days');
    this.operationService.dailyOperationsUpdate(this.operationType, this.reportDate.format())
  }

  increaseDate() {
    this.reportDate = this.reportDate.add(1, 'days');
    this.operationService.dailyOperationsUpdate(this.operationType, this.reportDate.format())
  }

  get isToday(): boolean {
    return this.reportDate.format("DD-MM-yyyy") === moment().format("DD-MM-yyyy");
  }

  get isYesterday(): boolean {
    return this.reportDate.format("DD-MM-yyyy") === moment().subtract(1, 'days').format("DD-MM-yyyy");
  }
}
