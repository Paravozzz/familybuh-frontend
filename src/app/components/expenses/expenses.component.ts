import { Component } from '@angular/core';
import {OperationTypeEnum} from "../../enums/OperationTypeEnum";

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {
  operationType = OperationTypeEnum;
  operationInputLoaded: boolean = false;

}
