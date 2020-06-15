import * as jsPDF from 'jspdf';
import { ExpenseItemService } from '../expense-item.service';

export class PDFExportUtils {
  calculatedItemsArray: Node[];

  constructor(public itemList: NodeList, private expenseItemService?: ExpenseItemService) {
    this.itemList = itemList;
    this.calculatedItemsArray = Array.from(this.itemList as NodeList);
  }

  exportAsPDF() {
    const doc = new jsPDF('p', 'px', 'a4');

    doc.text('Mortgage Expense Calculator', 20, 20);
    doc.text('CALCULATION REPORT', 20, 40);

    doc.save('Mortgage Expense Calculation.pdf');
  }
}
