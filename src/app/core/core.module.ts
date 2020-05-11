import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from '../app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { ShareButtonsComponent } from './header/share-buttons/share-buttons.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    NotFoundComponent,
    ShareButtonsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    NotFoundComponent,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule
  ],
})
export class CoreModule {
}
