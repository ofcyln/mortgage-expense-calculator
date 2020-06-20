import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ExpenseItemService } from '../../shared/expense-item.service';

import { PDFExportUtils } from '../../shared/utils/pdf-export.utils';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading = false;
  timeout!: number;
  donationContainerElementClassName = '[data-donation-container]';

  constructor(@Inject(DOCUMENT) private doc: Document, private expenseItemService: ExpenseItemService) {}

  pause(milliseconds: number) {
    return new Promise((resolve) => {
      this.timeout = setTimeout(resolve, milliseconds);

      return this.timeout;
    });
  }

  processFaster() {
    clearTimeout(this.timeout);

    // Items in Angular Material calculated item output
    const calculatedListItemElements = this.getQueryElements('mat-list-item article:last-child span') as NodeList;

    // Items in Angular Material calculated results output
    const calculatedResultItemElements = this.getQueryElements('[data-total-expense-amount]') as NodeList;

    // Mortgage amount field
    const mortgageAmount = this.getQueryElement('[data-mortgage-amount]') as HTMLInputElement;

    const pdfExportUtils = new PDFExportUtils(
      calculatedListItemElements,
      this.expenseItemService.expenseItems,
      calculatedResultItemElements,
      mortgageAmount,
    );

    pdfExportUtils.exportAsPDF();

    this.isLoading = false;

    this.stopAnimate('#bmc-wbtn', 'animate', '[data-donation-container]');
    this.stopAnimate('#at4-share', 'animate');
    this.stopAnimate('.at-expanding-share-button-toggle-bg', 'animate');
  }

  getQueryElement(query: string) {
    return this.doc.querySelector(query);
  }

  getQueryElements(query: string) {
    return this.doc.querySelectorAll(query);
  }

  animate(querySelector: string, className: string, source?: string) {
    const affectedElement = this.getQueryElement(querySelector);

    if (source === this.donationContainerElementClassName) {
      const container = this.getQueryElement('[data-router-container]');
      const isDataDonationContainer = !!this.getQueryElement('[data-donation-container]');

      if (!isDataDonationContainer) {
        const node = this.doc.createElement('section');
        node.setAttribute('data-donation-container', '');
        container?.appendChild(node);
      }

      const donationContainer = this.getQueryElement('[data-donation-container]');

      if (!!donationContainer && !!affectedElement) {
        donationContainer.appendChild(affectedElement);

        donationContainer.classList.add(className);
      }

      return;
    }

    if (affectedElement) {
      affectedElement.classList.add(className);
    }
  }

  stopAnimate(querySelector: string, className: string, source?: string) {
    const affectedElement = this.getQueryElement(querySelector);

    if (source === this.donationContainerElementClassName) {
      const donationContainer = this.getQueryElement('[data-donation-container]');

      if (!!donationContainer && !!affectedElement) {
        donationContainer.classList.remove(className);
      }

      return;
    }

    if (affectedElement) {
      affectedElement.classList.remove(className);
    }
  }
}
