import { Component, OnInit, OnDestroy } from '@angular/core';
import { UpdateService } from '../../services/update.service';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-notification',
  template: '',
})
export class UpdateNotificationComponent implements OnInit, OnDestroy {
  private updateSubscription: Subscription | null = null;
  private snackBarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;

  constructor(private updateService: UpdateService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Subscribe to update available events
    this.updateSubscription = this.updateService.updateAvailable$.subscribe((isAvailable) => {
      if (isAvailable) {
        this.showUpdateNotification();
      }
    });

    // Check for updates when the app starts
    this.checkForUpdate();
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  private checkForUpdate(): void {
    this.updateService.checkForUpdate().catch((err) => {
      console.error('Error checking for updates:', err);
    });
  }

  private showUpdateNotification(): void {
    // Dismiss any existing notification
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.snackBarRef = this.snackBar.open('A new version is available!', 'Update Now', {
      duration: 0, // Keep it open until user takes action
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['update-notification'],
    });

    this.snackBarRef.onAction().subscribe(() => {
      this.updateService.activateUpdate().catch((err) => {
        console.error('Error activating update:', err);
      });
    });
  }
}
