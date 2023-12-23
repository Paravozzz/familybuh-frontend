import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IncomesComponent} from './components/incomes/incomes.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {initializeKeycloak} from "./keycloak.init";
import {HttpClientModule} from "@angular/common/http";
import {AccountsComponent} from './components/accounts/accounts.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NavbarComponent} from './components/navbar/navbar.component';
import {ExpensesComponent} from './components/expenses/expenses.component';
import {CategoriesComponent} from './components/categories/categories.component';
import {CurrenciesComponent} from "./components/currencies/currencies.component";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {InitDialogComponent} from './components/init/init-dialog/init-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {CategoryDialogComponent} from "./components/category-dialog/category-dialog.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {OperationInputComponent} from './components/operation-input/operation-input.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import { OperationWigetComponent } from './components/operation-wiget/operation-wiget.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    OperationWigetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatMomentDateModule,
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
