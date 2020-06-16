import * as jsPDF from 'jspdf';

import { ExpenseItem } from '../expense-data.model';

export class PDFExportUtils {
  calculatedItemsArray: Node[];
  resultArray: Node[];

  constructor(
    public itemList: NodeList,
    public expenseItems: ExpenseItem[],
    public totalExpenseAmounts: NodeList,
    public mortgageAmount: HTMLInputElement,
  ) {
    this.itemList = itemList;
    this.expenseItems = expenseItems;
    this.totalExpenseAmounts = totalExpenseAmounts;
    this.mortgageAmount = mortgageAmount;

    this.calculatedItemsArray = Array.from(this.itemList as NodeList);
    this.resultArray = Array.from(this.totalExpenseAmounts);
  }

  exportAsPDF() {
    const img = new Image();
    img.src = 'assets/logo/mec-logo-with-title-indigo.jpeg';

    const doc = new jsPDF('p', 'mm', 'a4');

    // Logo area
    doc.addImage(img, 'JPEG', 10, 10, 15, 24);

    // Head section
    doc.setFont('helvetica');
    doc.text('Mortgage Expense Calculator', 30, 21);
    doc.text(' | ', 105, 21);
    doc.text('CALCULATION REPORT', 110, 21);

    doc.setFontStyle('normal');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('mortgageexpensecalculator.com', 30, 26);

    // Mortgage amount info area
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFontStyle('normal');
    doc.text('This calculation is for a mortgage amount of', 45, 45);
    doc.setFontStyle('bold');
    doc.text(`€${this.mortgageAmount.value}`, 143, 45);

    // Expense item generation
    this.expenseItems.forEach((element: ExpenseItem, index: number) => {
      this.generatePDFItem(index, element, this.calculatedItemsArray[index], doc);
    });

    // Line separator
    doc.setDrawColor(100);
    doc.line(10, 230, 200, 230);

    // Result area
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
    doc.text(this.resultArray[2].textContent?.split('help')[0], 100, 266);
    doc.setFontStyle('bold');
    doc.text(this.resultArray[2].textContent?.split('help')[1], 170, 266);

    // Circle point info area
    doc.setFontStyle('normal');
    doc.setFontSize(8);
    doc.setTextColor(134);
    doc.setLineWidth(0.3);

    doc.setFillColor(25, 189, 24);
    doc.circle(56, 277, 1, 'F');
    doc.text('Calculated', 59, 278);

    doc.setFillColor(239, 214, 19);
    doc.circle(82, 277, 1, 'F');
    doc.text('Not calculated(deselected)', 85, 278);

    doc.setFillColor(197, 48, 37);
    doc.circle(127, 277, 1, 'F');
    doc.text('Not applicable', 130, 278);

    // Footer support area
    doc.text(`'Mortgage Expense Calculator' is an open-source project and it needs your support.`, 50, 285);
    doc.text(`Don't forget to share and donate, please.`, 75, 288);

    // Filename creation and save
    doc.save(`Calculation report for €${this.mortgageAmount.value} - Mortgage Expense Calculator.pdf`);
  }

  generatePDFItem(idx: number, item: ExpenseItem, calculatedItem: Node, doc: jsPDF): void {
    const yPositionCircleGap = 12;

    doc.setFontStyle('normal');

    doc.setLineWidth(0.3);
    if (calculatedItem.textContent === ' €0 ') {
      doc.setFillColor(239, 214, 19);

      if (item.exceededAmount) {
        doc.setFillColor(197, 48, 37);
      }
    } else {
      doc.setFillColor(25, 189, 24);
    }
    doc.circle(18, 59 + yPositionCircleGap * idx, 1, 'F');

    doc.setFontSize(12);
    doc.setFontStyle('normal');
    doc.text(item.name, 22, 60 + yPositionCircleGap * idx);

    doc.setFontSize(12);
    doc.setFontStyle('bold');
    doc.text(calculatedItem.textContent === ' €0 ' ? ' 0' : calculatedItem.textContent, 170, 60 + yPositionCircleGap * idx);
  }
}
