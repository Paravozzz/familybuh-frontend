import {Injectable} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateAdapter} from "@ng-bootstrap/ng-bootstrap";
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {Moment} from "moment/moment";

const moment = _rollupMoment || _moment;

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private ngbCalendar: NgbCalendar,
              private dateAdapter: NgbDateAdapter<string>) {
  }

  public get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  /**
   * Если пользователем заданы ЧЧ и ММ, то берём пользовательское время, если нет, то текущее.
   * @param value
   * @private
   */
  public computeDateAndTime(value: any): string {
    let dateAndTime: _moment.Moment = moment();
    try {
      let m = value.date.month + '';
      if (m.length < 2)
        m = '0' + m;

      let d = value.date.day + '';
      if (d.length < 2)
        d = '0' + d;

      let dateString = value.date.year + "-" + m + "-" + d; //ISO 8601 Date Format
      dateAndTime = moment(dateString); //пользовательская дата с формы
    } catch {
      //do nothing
      console.log(dateAndTime);
    }
    //по-умолчанию текущее время
    let time = moment();
    let hh: number = time.hour();
    let mm: number = time.minute();
    let userTime: boolean = false;
    //пробуем распарсить пользовательское время
    try {
      if (value?.hour && value?.minute) {
        let hh_value = Number.parseInt(value.hour);
        let mm_value = Number.parseInt(value.minute);
        if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
          hh = hh_value;
          mm = mm_value;
          userTime = true;
        }
      }
    } catch {
      //do nothing
    }
    dateAndTime.hour(hh);
    dateAndTime.minute(mm);
    if (userTime) { //если было установлено пользовательское время
      dateAndTime.second(0);
      dateAndTime.millisecond(0);
    } else {
      dateAndTime.second(time.second());
      dateAndTime.millisecond(time.millisecond());
    }

    return dateAndTime.format();
  }

  public dbToView(operationDate: string|undefined): {date: NgbDate, hour: string, minute: string} {
    let date: Moment;
    if (operationDate != undefined) {
      date = moment(operationDate);
    } else {
      date = moment();
    }

    let year: number = date.year();
    let month: number = date.month() + 1;
    let day: number = date.date();
    let ngbDate: NgbDate = new NgbDate(year, month, day);
    let hour: string = moment(operationDate).format("H");
    let minute: string = moment(operationDate).format("m");
    return {date: ngbDate, hour: hour, minute: minute};
  }
}
