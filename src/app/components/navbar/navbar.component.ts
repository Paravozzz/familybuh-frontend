import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonNameEnum} from "src/app/enums/ButtonNameEnum";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output("activeButton") activeButtonEvent = new EventEmitter<ButtonNameEnum>();
  eButtonName = ButtonNameEnum;
}
