import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IncomesComponent} from './components/pages/incomes/incomes.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {initializeKeycloak} from "./keycloak.init";
import {HttpClientModule} from "@angular/common/http";
import {AccountsComponent} from './components/pages/accounts/accounts.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ExpensesComponent} from './components/pages/expenses/expenses.component';
import {CategoriesComponent} from './components/pages/categories/categories.component';
import {CurrenciesComponent} from "./components/pages/currencies/currencies.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InitDialogComponent} from './components/init/init-dialog/init-dialog.component';
import {CategoryDialogComponent} from "./components/category-dialog/category-dialog.component";
import {OperationInputComponent} from './components/operation-input/operation-input.component';
import { OperationWigetComponent } from './components/operation-wiget/operation-wiget.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { AccountDialogComponent } from './components/account-dialog/account-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    IncomesComponent,
    AccountsComponent,
    NavbarComponent,
    ExpensesComponent,
    CategoriesComponent,
    CurrenciesComponent,
    InitDialogComponent,
    CategoryDialogComponent,
    OperationInputComponent,
    OperationWigetComponent,
    SpinnerComponent,
    AccountDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
