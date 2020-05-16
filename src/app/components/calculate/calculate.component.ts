import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: [ './calculate.component.scss' ]
})
export class CalculateComponent implements OnInit {
  value = null;
  isCalculate = false;
  show = false;
  innerHeight = window.innerHeight;
  innerWidth = window.innerWidth;

  private readonly MOBILE_DEVICE_CONTROL_HEIGHT = 674;
  private readonly MOBILE_DEVICE_CONTROL_WIDTH = 599;
  private readonly TIME_IN_MS = 500;

  @HostListener('window:resize', [ '$event' ])
  onResize(event: any) {
    setTimeout(( () => {
      this.innerWidth = event.target.innerWidth;
      this.innerHeight = event.target.innerHeight;

      this.doc.body.style.height = `${ this.innerHeight }px`;

      this.innerHeight > this.MOBILE_DEVICE_CONTROL_HEIGHT || this.innerWidth > this.MOBILE_DEVICE_CONTROL_WIDTH
        ? this.show = true
        : this.show = false;
    } ), this.TIME_IN_MS);
  }

  constructor(@Inject(DOCUMENT) private doc: Document) {
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.doc.body.style.height = `${ this.innerHeight }px`;

    this.innerHeight > this.MOBILE_DEVICE_CONTROL_HEIGHT || this.innerWidth > this.MOBILE_DEVICE_CONTROL_WIDTH
      ? this.show = true
      : this.show = false;
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

  showMore() {
    this.show = !this.show;
  }

  refreshPage() {
    this.doc.defaultView?.location.reload();
  }

}
