import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ExpenseItemService } from '../../shared/expense-item.service';
import { LoadingService } from '../loading/loading.service';

import { PDFExportUtils } from '../../shared/utils/pdf-export.utils';

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

  private readonly MOBILE_DEVICE_CONTROL_HEIGHT = 674;
  private readonly MOBILE_DEVICE_CONTROL_WIDTH = 599;
  private readonly TIME_IN_MS_TO_REDRAW = 5e2;
  private readonly TIME_IN_MS_OF_INTERVAL = 1e3;
  private readonly COUNTDOWN_TIMER_IN_SECONDS = 10;

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

    this.loadingService.animate('#bmc-wbtn', 'animate', '[data-donation-container]');
    this.loadingService.animate('#at4-share', 'animate');
    this.loadingService.animate('.at-expanding-share-button-toggle-bg', 'animate');

    // Items in Angular Material calculated item output
    const calculatedListItemElements = this.loadingService.getQueryElements('mat-list-item article:last-child span') as NodeList;

    // Items in Angular Material calculated results output
    const calculatedResultItemElements = this.loadingService.getQueryElements('[data-total-expense-amount]') as NodeList;

    // Mortgage amount field
    const mortgageAmount = this.loadingService.getQueryElement('[data-mortgage-amount]') as HTMLInputElement;

    const pdfExportUtils = new PDFExportUtils(
      calculatedListItemElements,
      this.expenseItemService.expenseItems,
      calculatedResultItemElements,
      mortgageAmount,
    );

    this.loadingService.countDown(this.TIME_IN_MS_OF_INTERVAL, this.COUNTDOWN_TIMER_IN_SECONDS).then(() => {
      pdfExportUtils.exportAsPDF();

      this.loadingService.isLoading = false;

      this.loadingService.stopAnimate('#bmc-wbtn', 'animate', '[data-donation-container]');
      this.loadingService.stopAnimate('#at4-share', 'animate');
      this.loadingService.stopAnimate('.at-expanding-share-button-toggle-bg', 'animate');
    });
  }
}
