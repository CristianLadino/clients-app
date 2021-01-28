import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Client } from '../class/client';
import { Observable, of, throwError } from 'rxjs';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

import { Routes, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private urlEndPonit: string = 'http://localhost:8080/api/clients';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient, private router: Router) {}

  getClients(page): Observable<any> {
    // return of(CLIENTS);
    return this.http.get<Client[]>(this.urlEndPonit + '/page/' + page).pipe(
      tap((resp: any) => {
        console.log('ClientService: tap 1');
        (resp.content as Client[]).forEach((clients) => {
          console.log(clients.name);
        });
      }),
      map((resp: any) => {
        (resp.content as Client[]).map((client) => {
          client.name = client.name.toUpperCase();
          //client.last_name = client.last_name.toUpperCase();
          // client.createAt = formatDate(client.createAt, 'dd/MM/yyyy', 'en-US'); USANDO formatDate
          // let datePipe = new DatePipe('en-US');
          // client.createAt = datePipe.transform(client.createAt, 'dd-MMMM-yyyy'); // USANDO datePipe

          return client;
        });
        return resp;
      }),
      tap((resp) => {
        console.log('ClientService: tap 2');
        (resp.content as Client[]).forEach((clients) => {
          console.log(clients.name);
        });
      })
    );
  }

  create(client: Client): Observable<Client> {
    return this.http
      .post(this.urlEndPonit, client, { headers: this.httpHeaders })
      .pipe(
        map((res: any) => res.client as Client),
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  getClient(id): Observable<Client> {
    return this.http.get<Client>(`${this.urlEndPonit}/${id}`).pipe(
      catchError((e) => {
        this.router.navigate(['/clients']);
        console.error(e.error.mensaje);
        swal.fire('Error', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(client: Client): Observable<Client> {
    return this.http
      .put(`${this.urlEndPonit}/${client.id}`, client, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((res: any) => res.client as Client),
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);
          }

          this.router.navigate(['/clients']);
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: Number): Observable<Client> {
    return this.http
      .delete<Client>(`${this.urlEndPonit}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          this.router.navigate(['/clients']);
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  uploadPhoto(file: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();

    formData.append('file', file);
    formData.append('id', id);

    const req = new HttpRequest(
      'POST',
      `${this.urlEndPonit}/upload`,
      formData,
      {
        reportProgress: true,
      }
    );

    return this.http.request(req);
  }
}
