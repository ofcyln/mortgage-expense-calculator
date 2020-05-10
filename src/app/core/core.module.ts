import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from '../app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    HeaderComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    NotFoundComponent,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule
  ],
})
export class CoreModule {
}
