export interface ExpenseItems {
  name: string;
  amount: CostRanges;
  info: string;
  compulsory: boolean;
  taxDeductible: boolean;
  specialExpense?: boolean,
}

interface CostRanges {
  percentage: number[];
  costRange: MinMaxModel;
  bothApplicable: boolean;
}

interface MinMaxModel {
  min: number;
  max: number;
}
