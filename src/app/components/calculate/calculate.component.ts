import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: [ './calculate.component.scss' ]
})
export class CalculateComponent implements OnInit {
  value = null;
  isCalculate = false;

  constructor(@Inject(DOCUMENT) private doc: Document) {
  }

  ngOnInit(): void {
  }

  setCalculationState() {
    const showCalculation = !this.isCalculate
      && this.value !== null
      && this.value !== undefined
      && this.value !== '';

    if (showCalculation) {
      this.isCalculate = true;
    }
  }

  refreshPage() {
    this.doc.defaultView.location.reload();
  }

}
