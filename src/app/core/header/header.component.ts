import { Component, Inject, OnInit } from '@angular/core';
import { CustomIconService } from '../../shared/custom-icon.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
})
export class HeaderComponent implements OnInit {
  constructor(private customIconService: CustomIconService, @Inject(DOCUMENT) private doc: Document) {
    this.customIconService.addIcon('mecLogoEmpty', 'mecLogoEmpty.svg');
  }

  ngOnInit(): void {
  }

  refreshPage() {
    this.doc.defaultView?.location.reload();
  }
}
