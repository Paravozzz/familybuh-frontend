import {Currency} from "./Currency";

export interface TransferDto {
  transferId: number,
  amount: string,
  currency: Currency,
  expenseAccountName: string,
  incomeAccountName: string,
  description: string,
  date: string
}
