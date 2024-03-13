import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";
import {IncomesComponent} from "./components/pages/incomes/incomes.component";
import {ExpensesComponent} from "./components/pages/expenses/expenses.component";
import {CategoriesComponent} from "./components/pages/categories/categories.component";
import {AccountsComponent} from "./components/pages/accounts/accounts.component";
import {CurrenciesComponent} from "./components/pages/currencies/currencies.component";
import {TransfersComponent} from "./components/pages/transfers/transfers.component";
import {ExchangesComponent} from "./components/pages/exchanges/exchanges.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: ExpensesComponent,
    canActivate: [AuthGuard]
  },
  {path: "expenses", component: ExpensesComponent},
  {path: "incomes", component: IncomesComponent, canActivate: [AuthGuard]},
  {path: "categories", component: CategoriesComponent, canActivate: [AuthGuard]},
  {path: "accounts", component: AccountsComponent, canActivate: [AuthGuard]},
  {path: "currencies", component: CurrenciesComponent, canActivate: [AuthGuard]},
  {path: "transfers", component: TransfersComponent, canActivate: [AuthGuard]},
  {path: "exchanges", component: ExchangesComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
