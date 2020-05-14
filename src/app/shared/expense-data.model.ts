export interface ExpenseItem {
  name: string;
  amount: CostRanges;
  info: string;
  compulsory: boolean;
  taxDeductible: boolean;
  specialExpense?: boolean,
}

export interface CostRanges {
  percentage: number[];
  costRange: MinMaxModel;
  bothApplicable: boolean;
}

export interface MinMaxModel {
  min: number;
  max: number;
}

export interface ExpenseVariations {
  min: number;
  average: number;
  max: number;
}
