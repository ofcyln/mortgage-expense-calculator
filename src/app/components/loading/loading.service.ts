import { Injectable } from '@angular/core';
import { PDFExportUtils } from '../../shared/utils/pdf-export.utils';
import { ExpenseItemService } from '../../shared/expense-item.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading = false;
  timeout!: number;

  constructor(private expenseItemService: ExpenseItemService) {}

  pause(milliseconds: number) {
    return new Promise((resolve) => {
      this.timeout = setTimeout(resolve, milliseconds);

      return this.timeout;
    });
  }

  processFaster() {
    clearTimeout(this.timeout);

    const calculatedListItemElements = document.querySelectorAll('mat-list-item article:last-child span') as NodeList;
    const calculatedResultItemElements = document.querySelectorAll('.total-expense-amount') as NodeList;
    const mortgageAmount = document.querySelector('.mortgage-amount') as HTMLInputElement;

    const pdfExportUtils = new PDFExportUtils(
      calculatedListItemElements,
      this.expenseItemService.expenseItems,
      calculatedResultItemElements,
      mortgageAmount,
    );

    pdfExportUtils.exportAsPDF();

    this.isLoading = false;
  }
}
