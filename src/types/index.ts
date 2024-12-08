export interface CurrencyDetail {
  id: number;
  amount: number;
  quantity: number;
  total: number;
}

export interface CurrencyList {
  id: number;
  date: Date;
  prices: CurrencyDetail[];
  bankDeposit: number;
  qrDeposit: number;
  total: number;
}
