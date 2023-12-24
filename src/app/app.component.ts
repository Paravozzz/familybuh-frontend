import {AfterViewInit, Component} from '@angular/core';
import {ButtonNameEnum} from "./enums/ButtonNameEnum";
import {InitDialogComponent} from "./components/init/init-dialog/init-dialog.component";
import {InitService} from "./service/init.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  init: boolean = false;
  eButtonName = ButtonNameEnum;
  navbarActiveButton: ButtonNameEnum = ButtonNameEnum.EXPENSES;
  private initModalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private initService: InitService) {
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
    this.initModalRef = this.modalService.open(InitDialogComponent, {centered: true, backdrop: "static", keyboard: false});

    this.initModalRef.closed.subscribe(result => {
      if (result === true)
        this.init = result;
      else {
        alert("Не удалось инициализировать пользователя!");
      }
    });
  }
}
