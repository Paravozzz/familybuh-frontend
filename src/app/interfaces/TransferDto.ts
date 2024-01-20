export interface TransferDto {
  transferId: number,
  amount: string,
  currencyCode: string,
  expenseAccountName: string,
  incomeAccountName: string,
  description: string,
  date: string
}
