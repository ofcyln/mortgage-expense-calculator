import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { PDFExportUtils } from '../../shared/utils/pdf-export.utils';
import { ExpenseItemService } from '../../shared/expense-item.service';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.scss'],
})
export class CalculateComponent implements OnInit {
  value = null;
  isCalculate = false;
  show = false;
  innerHeight = window.innerHeight;
  innerWidth = window.innerWidth;
  donationContainerElementClassName = '.donation-container';

  private readonly MOBILE_DEVICE_CONTROL_HEIGHT = 674;
  private readonly MOBILE_DEVICE_CONTROL_WIDTH = 599;
  private readonly TIME_IN_MS_TO_REDRAW = 5e2;
  private readonly TIME_IN_MS_TO_EXPORT = 1e4;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    setTimeout(() => {
      this.innerWidth = event.target.innerWidth;
      this.innerHeight = event.target.innerHeight;

      this.doc.body.style.height = `${this.innerHeight}px`;

      this.innerHeight > this.MOBILE_DEVICE_CONTROL_HEIGHT || this.innerWidth > this.MOBILE_DEVICE_CONTROL_WIDTH
        ? (this.show = true)
        : (this.show = false);
    }, this.TIME_IN_MS_TO_REDRAW);
  }

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private expenseItemService: ExpenseItemService,
    public loadingService: LoadingService,
  ) {
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.doc.body.style.height = `${this.innerHeight}px`;

    this.innerHeight > this.MOBILE_DEVICE_CONTROL_HEIGHT || this.innerWidth > this.MOBILE_DEVICE_CONTROL_WIDTH
      ? (this.show = true)
      : (this.show = false);
  }

  setCalculationState() {
    const showCalculation = !this.isCalculate && this.value !== null && this.value !== undefined && this.value !== '';

    if (showCalculation) {
      this.isCalculate = true;
    }
  }

  showMore() {
    this.show = !this.show;
  }

  refreshPage() {
    this.doc.defaultView?.location.reload();
  }

  captureScreen() {
    this.loadingService.isLoading = true;

    this.animate('#bmc-wbtn', 'animate', '.donation-container');
    this.animate('#at4-share', 'animate');
    this.animate('.at-expanding-share-button-toggle-bg', 'animate');

    const calculatedListItemElements = document.querySelectorAll('mat-list-item article:last-child span') as NodeList;
    const calculatedResultItemElements = document.querySelectorAll('.total-expense-amount') as NodeList;
    const mortgageAmount = document.querySelector('.mortgage-amount') as HTMLInputElement;

    const pdfExportUtils = new PDFExportUtils(
      calculatedListItemElements,
      this.expenseItemService.expenseItems,
      calculatedResultItemElements,
      mortgageAmount,
    );

    this.loadingService.pause(this.TIME_IN_MS_TO_EXPORT).then(() => {
      pdfExportUtils.exportAsPDF();

      this.loadingService.isLoading = false;

      this.stopAnimate('#bmc-wbtn', 'animate', '.donation-container');
      this.stopAnimate('#at4-share', 'animate');
      this.stopAnimate('.at-expanding-share-button-toggle-bg', 'animate');
    });
  }

  animate(querySelector: string, className: string, source?: string) {
    const affectedElement = this.doc.querySelector(querySelector);

    if (source === this.donationContainerElementClassName) {
      const container = this.doc.querySelector('.router-container');
      const node = this.doc.createElement('section');
      node.classList.add('donation-container');
      container?.appendChild(node);

      const donationContainer = this.doc.querySelector('.donation-container');

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
    const affectedElement = this.doc.querySelector(querySelector);

    if (source === this.donationContainerElementClassName) {
      const donationContainer = this.doc.querySelector('.donation-container');

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
