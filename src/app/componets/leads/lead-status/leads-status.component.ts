import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {forkJoin, Subject, takeUntil} from 'rxjs';
import {NgForOf, NgIf} from '@angular/common';
import {ApiService, ICustomFields, ILead, ILeadCustomField, IStatus} from '../../../service/api.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-leads-status',
  imports: [MatExpansionModule, NgIf, MatProgressSpinner, CdkDropListGroup, CdkDropList, CdkDrag, NgForOf],
  templateUrl: './leads-status.component.html',
  standalone: true,
  styleUrl: './leads-status.component.scss'
})
export class LeadsStatusComponent implements OnInit, OnDestroy {
  API$: ApiService = inject(ApiService)
  destroy$: Subject<boolean> = new Subject<boolean>();
  Loader$: boolean
  Leads$: ILead[]
  // Statuses$: IStatus[]
  Statuses$: any[] = []

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.API$.Loader$.next(true)
      this.API$.setLead(event.item.data.lead_id, {status_id: event.container.id})
        .pipe(
          takeUntil(this.destroy$),
        )
        .subscribe(
          (res): void => {
            if (res.status === 200 && res.ok) {
              transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
              );
            }
            this.API$.Loader$.next(false)
          }
        )
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected _initData(): void {
    this.API$.Loader$.next(true)
    forkJoin({
      leads: this.API$.getLeads(),
      statuses: this.API$.getStatuses(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({leads, statuses}): void => {
        console.log(statuses)
        statuses.forEach((status: IStatus): void => {
          let leadItem: object[] = []
          leads.forEach(lead => {
            if(lead.status_id === status.id) {
              leadItem.push({
                lead_id: lead.id,
                lead_name: lead.name,
                status_id: lead.status_id
              })
            }
          })
          this.Statuses$.push({
            name: status.name,
            id: status.id,
            leads: leadItem
          })
        })
        console.log(this.Statuses$)
        this.API$.Loader$.next(false)
      })
  }

  ngOnInit(): void {
    this._initData()
    this.API$.Loader$.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => this.Loader$ = val)
  }
}
