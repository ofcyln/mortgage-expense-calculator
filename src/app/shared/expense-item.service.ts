import { Injectable } from '@angular/core';
import { ExpenseItem } from './expense-data.model';
import { expenseList } from './utils/expenseList';

@Injectable({
  providedIn: 'root',
})
export class ExpenseItemService {
  public expenseItems!: ExpenseItem[];

  constructor() {}

  setSharedExpenseItems(expenseItems: ExpenseItem[]): void {
    this.expenseItems = expenseItems;
  }

  getRawExpenseList(): ExpenseItem[] {
    return expenseList;
  }
}
