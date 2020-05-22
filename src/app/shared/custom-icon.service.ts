import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class CustomIconService {
  private readonly ICON_BASE_URL = './assets/custom-font-icons/';

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  addIcon(iconName: string, url: string): void {
    this.matIconRegistry.addSvgIcon(iconName, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.ICON_BASE_URL}${url}`));
  }
}
