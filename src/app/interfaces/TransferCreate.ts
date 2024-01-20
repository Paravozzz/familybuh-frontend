export interface TransferCreate {
  amount: string,
  currencyCode: string,
  expenseAccountId: number,
  incomeAccountId: number,
  description: string,
  date: string,
}
