import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: [ './calculate.component.scss' ]
})
export class CalculateComponent implements OnInit {
  value = null;

  constructor() {
  }

  ngOnInit(): void {
  }

}
