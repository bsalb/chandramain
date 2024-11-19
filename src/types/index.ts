export interface CurrencyDetail {
  id: number;
  amount: number;
  quantity: number;
  total: number;
  currencyDataId: number;
}

export interface CurrencyList {
  id: number;
  date: Date;
  prices: CurrencyDetail[];
  bankDeposit: number;
  total: number;
}
