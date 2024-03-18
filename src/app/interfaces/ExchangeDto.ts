import {Currency} from "./Currency";

export interface ExchangeDto {
  expenseAmount: string,
  incomeAmount: string,
  expenseCurrency: Currency,
  incomeCurrency: Currency,
  accountName: string,
  description: string,
  date: string,
}
