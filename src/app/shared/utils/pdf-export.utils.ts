import * as jsPDF from 'jspdf';

import { ExpenseItem } from '../expense-data.model';

export class PDFExportUtils {
  calculatedItemsArray: Node[];
  resultArray: Node[];

  constructor(public itemList: NodeList, public expenseItems: ExpenseItem[], public totalExpenseAmounts: NodeList) {
    this.itemList = itemList;
    this.expenseItems = expenseItems;
    this.totalExpenseAmounts = totalExpenseAmounts;

    this.calculatedItemsArray = Array.from(this.itemList as NodeList);
    this.resultArray = Array.from(this.totalExpenseAmounts);
  }

  exportAsPDF() {
    const img = new Image();
    img.src = 'assets/logo/mec-logo-with-title-indigo.jpg';

    const doc = new jsPDF('p', 'mm', 'a4');

    doc.addImage(img, 'JPEG', 10, 10, 15, 24);

    doc.setFont('helvetica');
    doc.text('Mortgage Expense Calculator', 30, 23);

    doc.text(' | ', 105, 23);
    doc.setFontStyle('bold');

    doc.text('CALCULATION REPORT', 110, 23);

    this.expenseItems.forEach((element: ExpenseItem, index: number) => {
      this.generatePDFItem(index, element, this.calculatedItemsArray[index], doc);
    });

    doc.line(10, 230, 200, 230);

    doc.setFontStyle('bold');
    doc.setFontSize(14);
    doc.text(this.resultArray[0].textContent?.split('help')[0], 100, 242);

    doc.text(this.resultArray[0].textContent?.split('help')[1], 170, 242);

    doc.setFontStyle('normal');
    doc.setFontSize(11);
    doc.text(this.resultArray[1].textContent?.split('help')[0], 100, 254);
    doc.setFontStyle('bold');
    doc.text(this.resultArray[1].textContent?.split('help')[1], 170, 254);

    doc.setFontStyle('normal');
    doc.setFontSize(11);
    doc.text(this.resultArray[2].textContent?.split('help')[0], 100, 266);
    doc.setFontStyle('bold');
    doc.text(this.resultArray[2].textContent?.split('help')[1], 170, 266);

    doc.setFontStyle('normal');
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`'Mortgage Expense Calculator' is an open-source project and it needs your support.`, 50, 285);

    doc.text(`Don't forget to share and donate, please.`, 75, 288);

    doc.save('Mortgage Expense Calculator - CALCULATION REPORT.pdf');
  }

  generatePDFItem(idx: number, item: ExpenseItem, calculatedItem: Node, doc: jsPDF): void {
    const yPositionCircleGap = 12;

    doc.setFontStyle('normal');

    doc.setLineWidth(0.3);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.circle(18, 59 + yPositionCircleGap * idx, 1, 'FD');

    doc.setFontSize(12);
    doc.setFontStyle('normal');
    doc.text(item.name, 22, 60 + yPositionCircleGap * idx);

    doc.setFontSize(12);
    doc.setFontStyle('bold');
    doc.text(calculatedItem.textContent, 170, 60 + yPositionCircleGap * idx);
  }
}
