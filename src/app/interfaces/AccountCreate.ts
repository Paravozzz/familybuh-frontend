import {AccountBalanceCreate} from "./AccountBalanceCreate";

export interface AccountCreate {
  name: string,
  description: string,
  initialBalance: AccountBalanceCreate[]
}
