import { Component, OnInit } from '@angular/core';
import { CustomIconService } from '../../shared/custom-icon.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
})
export class HeaderComponent implements OnInit {
  constructor(private customIconService: CustomIconService) {
    this.customIconService.addIcon('mecLogoEmpty', 'mecLogoEmpty.svg');
  }

  ngOnInit(): void {
  }
}
