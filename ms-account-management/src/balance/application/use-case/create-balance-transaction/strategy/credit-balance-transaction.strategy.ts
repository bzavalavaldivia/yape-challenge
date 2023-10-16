import { BalanceTransactionStrategy } from './balance-transaction.strategy';

export class CreditBalanceTransactionStrategy
  implements BalanceTransactionStrategy
{
  public execute(currentBalance: number, newAmount: number): number {
    return Number(currentBalance) + Number(newAmount);
  }
}