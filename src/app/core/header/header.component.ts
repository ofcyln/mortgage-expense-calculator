import { Component, Inject } from '@angular/core';
import { CustomIconService } from '../../shared/custom-icon.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private customIconService: CustomIconService, @Inject(DOCUMENT) private doc: Document) {
    this.customIconService.addIcon('mecLogoEmpty', 'mecLogoEmpty.svg');
  }

  refreshPage() {
    this.doc.defaultView?.location.reload();
  }
}
