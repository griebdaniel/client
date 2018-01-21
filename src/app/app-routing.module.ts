import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FillTableComponent } from './fill-table/fill-table.component';
import { LoginComponent } from './login/login.component';
import { TableCellContentComponent } from './table-cell-content/table-cell-content.component';

const routes: Routes = [
  { path: 'home', component: FillTableComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cellContent', component: TableCellContentComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
