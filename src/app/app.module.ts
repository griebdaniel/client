import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import {
  MatButtonModule, MatCheckboxModule, MatMenuModule, MatTabsModule, MatAutocompleteModule,
  MatInputModule, MatTableModule, MatSelectModule, MatToolbarModule, MatSnackBarModule,
  MatCardModule, MatIconModule, MatListModule, MatExpansionModule, MatSidenavModule, MatPaginatorModule,
  MatDatepickerModule, MatNativeDateModule, MatDialogModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { TableCellContentComponent } from './table-cell-content/table-cell-content.component';
import { TableCardComponent } from './table-card/table-card.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ManyRowComponent } from './many-row/many-row.component';
import { FillTableComponent } from './fill-table/fill-table.component';

import { DynamicWidthDirective } from './many-row/dynamic-width.directive';
import { MarginAlignDirective } from './many-row/margin-align.directive';
import { AlignWidthDirective } from './many-row/align-width.directive';
import { TableEditingComponent } from './table-editing/table-editing.component';
import { TableEditing2Component } from './table-editing2/table-editing2.component';
import { TogetherComponent } from './together/together.component';

import { TableService } from './dbservice/table.service';
import { TogetherDirective } from './together/together.directive';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './login/login.component';

// import {
//   DialogComponent, DialogContentComponent
// } from './dialog-test/dialog.component';

import {
  DialogContentComponent
} from './fill-table/dialog-content.component';

@NgModule({
  declarations: [
    AppComponent, TableCellContentComponent, TableCardComponent, TableEditingComponent,
    TogetherComponent, FillTableComponent, TableEditing2Component,
    AutocompleteComponent, ManyRowComponent, DynamicWidthDirective, TogetherDirective,
    MarginAlignDirective, AlignWidthDirective, LoginComponent, DialogContentComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MatInputModule, MatToolbarModule,
    MatTableModule, MatCheckboxModule, MatCardModule, MatSnackBarModule,
    MatIconModule, MatAutocompleteModule, MatListModule, MatButtonModule,
    MatSelectModule, MatSidenavModule, MatTabsModule,
    MatExpansionModule, MatMenuModule, FormsModule, HttpModule, MatPaginatorModule,
    MatNativeDateModule, MatDatepickerModule, AppRoutingModule, MatDialogModule,
  ],
  providers: [TableService],
  bootstrap: [AppComponent],
  entryComponents: [ DialogContentComponent ],
})
export class AppModule { }
