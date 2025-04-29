import { Component, OnInit } from '@angular/core';
import { UpdateService } from '../../services/update.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-notification',
  template: '',
})
export class UpdateNotificationComponent implements OnInit {
  constructor(private updateService: UpdateService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Subscribe to update available events
    this.updateService.updateAvailable$.subscribe((isAvailable) => {
      if (isAvailable) {
        this.showUpdateNotification();
      }
    });

    // Check for updates when the app starts
    this.checkForUpdate();
  }

  private checkForUpdate(): void {
    this.updateService.checkForUpdate().then((isAvailable) => {
      if (isAvailable) {
        this.updateService.setUpdateAvailable(true);
      }
    });
  }

  private showUpdateNotification(): void {
    const snackBarRef = this.snackBar.open('A new version is available!', 'Update Now', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['update-notification'],
    });

    snackBarRef.onAction().subscribe(() => {
      this.updateService.activateUpdate();
    });
  }
}
