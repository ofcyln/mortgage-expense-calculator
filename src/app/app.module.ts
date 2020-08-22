import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';

import { environment } from '../environments/environment';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgxMaskModule } from 'ngx-mask';

import { CoreModule } from './core/core.module';
import { CalculateComponent } from './components/calculate/calculate.component';
import { AppComponent } from './app.component';
import { ResultsComponent } from './components/calculate/results/results.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [AppComponent, CalculateComponent, ResultsComponent, LoadingComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    NgxMaskModule.forRoot(),
    ScrollToModule.forRoot(),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'nl',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
