export interface ExchangeCreate {
  expenseAmount: string,
  incomeAmount: string,
  expenseCurrencyCode: string,
  incomeCurrencyCode: string,
  accountId: number,
  description: string,
  date: string,
}
