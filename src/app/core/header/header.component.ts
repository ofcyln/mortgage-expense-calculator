import { Component } from '@angular/core';
import { CustomIconService } from '../../shared/custom-icon.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private document: Document;

  constructor(private customIconService: CustomIconService) {
    this.document = window.document;
    this.customIconService.addIcon('mecLogoEmpty', 'mecLogoEmpty.svg');
  }

  refreshPage() {
    this.document.defaultView?.location.reload();
  }
}
