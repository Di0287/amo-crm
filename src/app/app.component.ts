import {Component, OnInit} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {NavigationComponent} from './navigation/navigation.component';

@Component({
  selector: 'app-root',
  imports: [
    MatSidenavModule,
    NavigationComponent
  ],
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
