import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: [ './calculate.component.scss' ]
})
export class CalculateComponent implements OnInit {
  value = null;
  isCalculate = false;

  constructor() {
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

}
