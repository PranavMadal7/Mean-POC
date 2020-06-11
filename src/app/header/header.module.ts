import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { AppHeaderComponent } from './app-header/app-header.component';
import { AppRoutingModule } from '../app-routing/app-routing.module';

@NgModule({
  declarations: [ AppHeaderComponent ],
  imports: [
    CommonModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  exports: [AppHeaderComponent]
})
export class AppHeaderModule { }
