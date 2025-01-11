import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {ApiService, ICustomFields, IEnums, ILead, ILeadCustomField, IStatus} from '../../../service/api.service';
import {ActivatedRoute} from '@angular/router';
import {forkJoin, Subject, takeUntil} from 'rxjs';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-lead-edit',
  imports: [
    MatLabel,
    MatFormField,
    MatInput,
    MatOption,
    MatSelect,
    FormsModule,
    NgIf,
    NgForOf,
    NgSwitchCase,
    MatCheckbox,
    NgSwitch,
    MatButton,
    MatProgressSpinner
  ],
  templateUrl: './lead-edit.component.html',
  standalone: true,
  styleUrl: './lead-edit.component.scss'
})
export class LeadEditComponent implements OnInit, OnDestroy {
  API$: ApiService = inject(ApiService)
  Loader$: boolean = false
  destroy$: Subject<boolean> = new Subject<boolean>();
  private route: ActivatedRoute = inject(ActivatedRoute);
  lead: ILead;
  statuses: IStatus[] = [];
  customFieldsValues: ICustomFields[]
  id: number = this.route.snapshot.params["id"]

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.API$.Loader$.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => this.Loader$ = val)
    this._initData()
  }

  protected _initData():void {
    this.API$.Loader$.next(true)
    forkJoin({
      lead: this.API$.getLead(this.id),
      customFields: this.API$.getCustomFields(),
      statuses: this.API$.getStatuses(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({lead, customFields, statuses}): void => {
        this.statuses = statuses
        this.customFieldsValues = customFields

        this.lead = {
          id: lead.id,
          name: lead.name,
          price: lead.price,
          status_id: lead.status_id,
          custom_fields_values: []
        }

        customFields?.forEach((item: ICustomFields): void => {
          let customFieldsValues = lead.custom_fields_values?.find((el: ILeadCustomField): boolean => el.field_id === item.id) || null

          let values = null
          if(customFieldsValues == null) {
            values = null
          } else if (customFieldsValues.field_type === 'select') {
            values = customFieldsValues.values[0].enum_id
          } else {
            values = customFieldsValues.values[0].value
          }

          this.lead.custom_fields_values.push({
            field_id: item.id,
            field_name: item.name,
            field_type: item.type,
            values: values
          })
        })
        this.API$.Loader$.next(false)
      })
  }

  selectOptions(field_id: number): IEnums[] {
    return this.customFieldsValues?.find((el: ICustomFields): boolean => el.id === field_id)?.enums || []
  }

  setLead(): void {
    this.API$.Loader$.next(true)
    let leadSave = JSON.parse(JSON.stringify(this.lead))
    leadSave.custom_fields_values.map((item: any) => {
      let values: any = null
      if (item.field_type === 'select') {
        values = [
          {
            enum_id: item.values
          }
        ]
      } else {
        values = [
          {
            value: item.values
          }
        ]
      }
      item.values = values
      return item
    })

    this.API$.setLead(this.id, leadSave)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        () => this._initData()
      )
  }
}
