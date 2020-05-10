import { Component } from '@angular/core';
import { CustomIconService } from '../../../shared/custom-icon.service';

@Component({
  selector: 'app-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: [ './share-buttons.component.scss' ]
})
export class ShareButtonsComponent {

  constructor(
    private customIconService: CustomIconService
  ) {
    this.customIconService.addIcon('twitter', 'twitter.svg');

    this.customIconService.addIcon('github', 'github.svg');
  }
}
