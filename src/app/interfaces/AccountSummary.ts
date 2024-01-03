import {AccountBalance} from "./AccountBalance";

export interface AccountSummary {
  name: string,
  description: string,
  initialBalance: AccountBalance[]
}
