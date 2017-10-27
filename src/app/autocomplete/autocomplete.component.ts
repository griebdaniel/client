import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
  options = ['ABC', 'ABCD', 'CDEFG', 'KLMN'];

  constructor() { }

  ngOnInit() { }
}
