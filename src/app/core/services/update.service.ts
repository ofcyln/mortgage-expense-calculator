import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private updateAvailable = new BehaviorSubject<boolean>(false);
  updateAvailable$ = this.updateAvailable.asObservable();

  constructor(private swUpdate: SwUpdate) {
    // Check for updates every 6 hours
    if (swUpdate.isEnabled) {
      interval(6 * 60 * 60 * 1000).subscribe(() => swUpdate.checkForUpdate());
    }
  }

  // Check for updates manually
  checkForUpdate(): Promise<boolean> {
    return this.swUpdate.checkForUpdate();
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
