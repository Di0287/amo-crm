import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {ApiService, ILead} from '../../service/api.service';
import {Subject, takeUntil} from 'rxjs';
import {NgForOf, NgIf} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

export interface IDataLeads {
  name: string;
  value: string;
}

@Component({
  selector: 'app-leads',
  imports: [MatExpansionModule, NgForOf, MatTableModule, MatButton, RouterLink, NgIf, MatProgressSpinner],
  templateUrl: './leads.component.html',
  standalone: true,
  styleUrl: './leads.component.scss'
})
export class LeadsComponent implements OnInit, OnDestroy {
  API$: ApiService = inject(ApiService)
  destroy$: Subject<boolean> = new Subject<boolean>();
  Loader$: boolean
  Leads$: ILead[]

  displayedColumns: string[] = ['name', 'value'];

  CustomFieldsLead(fields: any): IDataLeads[] {
    let data: IDataLeads[] = []
    fields.forEach((item: any): void => {
      if (item.field_type === 'text' || item.field_type === 'textarea') {
        data.push({
          name: item.field_name,
          value: item.values[0].value
        })
      } else if (item.field_type === 'checkbox') {
        data.push({
          name: item.field_name,
          value: item.values[0].value ? 'Да' : 'Нет'
        })
      } else if (item.field_type === 'multiselect' || item.field_type === 'select') {
        let valText: string = '';
        item.values.forEach((val: any): void => {
          if (valText === '' ) {
            valText = val.value
          } else {
            valText += ', ' + val.value
          }
        })
        data.push({
          name: item.field_name,
          value: valText
        })
      }
    })

    return data
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  _initData(): void {
    this.API$.Loader$.next(true)
    this.API$.getLeads()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: ILead[]) => {
          this.Leads$ = res
        }
      )
  }
  ngOnInit(): void {
    this._initData()
    this.API$.Loader$.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => this.Loader$ = val)
  }
}
