import { Injectable, OnDestroy } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UpdateService implements OnDestroy {
  private updateAvailable = new BehaviorSubject<boolean>(false);
  updateAvailable$ = this.updateAvailable.asObservable();
  private subscriptions: Subscription[] = [];

  constructor(private swUpdate: SwUpdate) {
    // Check for updates every 5 minutes
    if (swUpdate.isEnabled) {
      this.subscriptions.push(
        interval(5 * 60 * 1000).subscribe(() => {
          this.checkForUpdate();
        }),
      );
    }

    // Handle version ready events
    this.subscriptions.push(
      this.swUpdate.versionUpdates.pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')).subscribe(() => {
        this.setUpdateAvailable(true);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Check for updates manually
  checkForUpdate(): Promise<boolean> {
    return this.swUpdate.checkForUpdate().then((isAvailable) => {
      if (isAvailable) {
        this.setUpdateAvailable(true);
      }
      return isAvailable;
    });
  }

  // Set update available state
  setUpdateAvailable(isAvailable: boolean): void {
    this.updateAvailable.next(isAvailable);
  }

  // Activate the update
  activateUpdate(): Promise<void> {
    return this.swUpdate.activateUpdate().then(() => {
      // Reload the page to apply the update
      window.location.reload();
    });
  }
}
