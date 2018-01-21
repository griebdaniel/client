import { Component, OnInit } from '@angular/core';
import { TableService } from '../dbservice/table.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(private router: Router, private tableService: TableService) { }

  ngOnInit() {
  }

  async login() {
    const res = await this.tableService.login('test', 'test');

    console.log('result = ', res);
    // if (res === true) {
    //   this.router.navigate(['/home']);
    // }
  }

}
