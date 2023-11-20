import {Component} from '@angular/core';
import {OperationTypeEnum} from "../../enums/OperationTypeEnum";

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.css']
})
export class IncomesComponent {
  operationType = OperationTypeEnum;
  operationInputLoaded: boolean = false;

}
