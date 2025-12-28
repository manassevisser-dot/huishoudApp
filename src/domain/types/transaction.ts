//====
// ./src/types/transaction.ts


export type PaymentMethod = 'pin' | 'contant' | 'creditcard';

export type TransactionCategory =
  | 'Boodschappen'
  | 'Vervoer'
  | 'Horeca'
  | 'Winkelen'
  | 'Cadeaus'
  | 'Overig';

export interface DailyTransaction {
  id?: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: TransactionCategory;
  subcategory?: string;
  paymentMethod: PaymentMethod;
  weekNumber: number;
  createdAt?: string;
}

export interface TransactionSummary {
  totalVariableMonth: number;
  totalVariableWeek: number;
}
//====

