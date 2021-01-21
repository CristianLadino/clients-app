import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nav-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnInit {
  @Input() paginator: any;

  pages: number[];

  constructor() {}

  ngOnInit(): void {
    this.pages = new Array(this.paginator.totalPages)
      .fill(0)
      .map((_value, index) => index + 1);
  }
}
