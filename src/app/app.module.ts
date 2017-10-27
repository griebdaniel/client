import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import {
  MatButtonModule, MatCheckboxModule, MatMenuModule,
  MatInputModule, MatTableModule, MatSelectModule,
  MatCardModule, MatIconModule, MatListModule, MatExpansionModule,
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
import { AddDirective } from './together/add.directive';


@NgModule({
  declarations: [
    AppComponent, TableCellContentComponent, TableCardComponent, TableEditingComponent,
    TogetherComponent, FillTableComponent, TableEditing2Component,
    AutocompleteComponent, ManyRowComponent, DynamicWidthDirective, TogetherDirective,
    MarginAlignDirective, AlignWidthDirective, AddDirective,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MatInputModule,
    MatTableModule, MatCheckboxModule, MatCardModule, MatIconModule,
    MatListModule, MatButtonModule, MatSelectModule,
    MatExpansionModule, MatMenuModule, FormsModule, HttpModule,
  ],
  providers: [TableService],
  bootstrap: [AppComponent]
})
export class AppModule { }
