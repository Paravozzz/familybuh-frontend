import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";
import {IncomesComponent} from "./components/pages/incomes/incomes.component";
import {ExpensesComponent} from "./components/pages/expenses/expenses.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: ExpensesComponent,
    canActivate: [AuthGuard]
  },
  {path: "expenses", component: ExpensesComponent},
  {path: "incomes", component: IncomesComponent, canActivate: [AuthGuard]},
  {path: "categories", component: IncomesComponent, canActivate: [AuthGuard]},
  {path: "accounts", component: IncomesComponent, canActivate: [AuthGuard]},
  {path: "currencies", component: IncomesComponent, canActivate: [AuthGuard]},
  {path: "transfers", component: IncomesComponent, canActivate: [AuthGuard]},
  {path: "exchanges", component: IncomesComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
