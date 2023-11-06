import {Component} from '@angular/core';
import {ButtonNameEnum} from "./enums/ButtonNameEnum";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'familybuh';
  eButtonName = ButtonNameEnum;
  navbarActiveButton: ButtonNameEnum = ButtonNameEnum.EXPENSES;
}
