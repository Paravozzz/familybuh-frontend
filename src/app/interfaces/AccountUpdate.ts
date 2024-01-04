import {AccountBalanceUpdate} from "./AccountBalanceUpdate";

export interface AccountUpdate {
  name: string,
  description: string,
  initialBalance: AccountBalanceUpdate[]
}
