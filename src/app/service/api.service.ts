import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, filter, Observable, tap} from 'rxjs';
import {map} from 'rxjs/operators';

const AmoToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImRmMWRmYmNkZTdmYTJkYzZjZGQ1MmNhYmU1MDQ1YTQzZDQ0NDZjOGIzYTc3OTE5ZWUyMWI2ZDUyZTM3ZTE1ZGQyMWQxOTAxYTk3NTE5MGQ1In0.eyJhdWQiOiI3NjQxM2M4ZC01ZDFiLTRmOWMtOTdjOS0yMWY5MGM1NTk0ODkiLCJqdGkiOiJkZjFkZmJjZGU3ZmEyZGM2Y2RkNTJjYWJlNTA0NWE0M2Q0NDQ2YzhiM2E3NzkxOWVlMjFiNmQ1MmUzN2UxNWRkMjFkMTkwMWE5NzUxOTBkNSIsImlhdCI6MTczNTU4MDEzOSwibmJmIjoxNzM1NTgwMTM5LCJleHAiOjE4OTMyODMyMDAsInN1YiI6IjkyMDQ2NzQiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzA4NDE4NTQsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6Miwic2NvcGVzIjpbImNybSIsImZpbGVzIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyIsInB1c2hfbm90aWZpY2F0aW9ucyJdLCJoYXNoX3V1aWQiOiJlOWY5OGYxNS00N2Y1LTQ2NTktYThlMi0yODRmYzg4YWVmMDMiLCJhcGlfZG9tYWluIjoiYXBpLWIuYW1vY3JtLnJ1In0.hwKPADg0hAfo5FyfUGtMizj_fNZ_WX5XNCbuXzFwADADw1LHS7_xSVPkl9BqBKklt2y6NYALGxaZDKgP8_qxK0J1c4FiFw6XD1_Wz2hLzWbNjjH-CrGjFGLFkxUO5QPX8owGBAJwXPcE58RalJ4MxIm1NRshEdW0tlyGonJEpIVChFoNm7D2ZLuIp18QjL179dS0FQNDHbYGzOFDTnuF_Jwa0f4y-KwARbrwIsdscphE_NcZSzzUKA2bnAzkLJPkGmCTzbiN8afkxqbmw-06CP_2eBynmr4yD4PLtK1LO8GGwzMjW_JjZLHWPhIuQaxoNTKf36rt51xx2QYXNsiqbw';

const Headers: HttpHeaders = new HttpHeaders({
  'Authorization':'Bearer ' + AmoToken,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

export interface ILead {
  id: number;
  name: string;
  price: number;
  status_id: number;
  custom_fields_values: ILeadCustomField[]
}

export interface ILeadCustomField {
  field_id: number;
  field_name: string;
  field_type: string;
  values: [value: string][];
}

export interface IStatus {
  id: number;
  name: string;
  type: number;
}

export interface ICustomFields {
  id: number;
  name: string;
  type: string;
  enums: IEnums[];
}

export interface IEnums {
  id: number;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http: HttpClient = inject(HttpClient);
  Loader$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  getLeads():Observable<ILead[]>{
    return this.http.request<any>('GET', `api/leads`, {
      headers: Headers,
      observe: "response",
      withCredentials: true,
      responseType: "json"
    }).pipe(
      map((res: HttpResponse<any>) => {
        this.Loader$.next(false)
        if (res.status === 200 && res.ok) {
          return res.body._embedded.leads
        } else {
          return []
        }
      }),
    );
  }

  getLead(id: number):Observable<any>{
    return this.http.request<any>('GET', `api/leads/${id}`, {
      headers: Headers,
      observe: "response",
      withCredentials: true,
      responseType: "json"
    }).pipe(
      map((res: HttpResponse<any>) => {
        if (res.status === 200 && res.ok) {
          return res.body
        } else {
          return []
        }
      }),
    );
  }

  getCustomFields():Observable<any>{
    return this.http.request<any>('GET', `api/leads/custom_fields`, {
      headers: Headers,
      observe: "response",
      withCredentials: true,
      responseType: "json"
    }).pipe(
      map((res: HttpResponse<any>) => {
        if (res.status === 200 && res.ok) {
          return res.body._embedded.custom_fields?.filter((el: any) => !el.group_id)
        } else {
          return []
        }
      }),
    );
  }

  getStatuses():Observable<IStatus[]>{
    return this.http.request<any>('GET', `api/leads/pipelines/6414538/statuses`, {
      headers: Headers,
      observe: "response",
      withCredentials: true,
      responseType: "json"
    }).pipe(
      map((res: HttpResponse<any>) => {
        if (res.status === 200 && res.ok) {
          return res.body._embedded.statuses?.filter((el: IStatus): boolean => el.type === 0)
        } else {
          return []
        }
      })
    );
  }

  setLead(id: number, data: any):Observable<any>{
    return this.http.request<any>('PATCH', `api/leads/${id}`, {
      body: JSON.stringify(data),
      headers: Headers,
      observe: "response",
      withCredentials: true,
      responseType: "json"
    });
  }
}
