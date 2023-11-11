import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ButtonNameEnum} from "./enums/ButtonNameEnum";
import {MatDialog} from "@angular/material/dialog";
import {InitDialogComponent} from "./components/init/init-dialog/init-dialog.component";
import {InitService} from "./service/init.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  init: boolean = false;
  eButtonName = ButtonNameEnum;
  navbarActiveButton: ButtonNameEnum = ButtonNameEnum.EXPENSES;


  constructor(public dialog: MatDialog, private initService: InitService) {
  }

  ngAfterViewInit() {
    this.initService.checkInit().subscribe({
      next: isInit => {
        if (isInit) {
          this.init = isInit;
        } else {
          this.openInitDialog();
        }
      }
    })
  }

  private openInitDialog() {
    const dialogRef = this.dialog.open(InitDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
        this.init = result;
      else {
        alert("Не удалось инициализировать пользователя!");
      }
    });
  }
}
