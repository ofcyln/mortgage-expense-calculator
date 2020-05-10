import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';

import { CoreModule } from './core/core.module';

import { CalculateComponent } from './components/calculate/calculate.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    CalculateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
