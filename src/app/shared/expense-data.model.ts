export interface ExpenseItem {
  name: string;
  amount: CostRanges;
  info: string;
  compulsory: boolean;
  taxDeductible: boolean;
  checked?: boolean;
  specialExpense?: boolean;
  approximate?: boolean;
  exceededAmount?: boolean;
}

export interface CostRanges {
  percentage: number[];
  costRange: MinMaxModel;
  botnPercentageAndValueApplicableOnCalculation: boolean;
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
