import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgForOf, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'amo-crm';

  protected readonly routeList: { path: string; name: string }[] = [
    {path: '/leads', name: 'СДЕЛКИ'},
    {path: '/contacts', name: 'КОНТАКТЫ'},
    {path: '/stages', name: 'ЭТАПЫ'},
  ];
  ngOnInit() {

  }
}
