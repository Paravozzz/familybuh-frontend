import {Component, Input, OnInit} from '@angular/core';
import {OperationService} from "../../service/operation.service";
import {Observable} from "rxjs";
import {OperationDto} from "../../interfaces/OperationDto";
import {OperationTypeEnum} from "../../enums/OperationTypeEnum";
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

  constructor(private operationService: OperationService) {
    this.dailyOperations = this.operationService.dailyOperations;
  }

  ngOnInit(): void {
    this.operationService.dailyOperationsUpdate(this.operationType, moment().format());
  }
}
