import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Setting} from '../interfaces/Setting';
import {SettingCreate} from "../interfaces/SettingCreate";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) {
  }

  public findByName(name: string): Observable<Setting> {
    return this.http
      .get<Setting>("/api/user/setting/name/" + name, {withCredentials: true});
  }

  public save(settingCreate: SettingCreate): Observable<Setting> {
    return this.http
      .post<Setting>("/api/user/setting", settingCreate, {withCredentials: true});
  }
}
