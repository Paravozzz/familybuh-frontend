import {Currency} from "./Currency";

export interface OperationDto {
  operationId: number,
  amount: string,
  currency: Currency,
  accountId: number,
  accountName: string,
  categoryId: number,
  category: string,
  description: string,
  date: string
}
