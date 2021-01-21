import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directive',
  templateUrl: './directive.component.html',
  styleUrls: ['./directive.component.css'],
})
export class DirectiveComponent implements OnInit {
  listCourses: String[] = ['TypeScript', 'JavaScript', 'Java SE', 'C#', 'PHP'];
  view: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
