import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ZutatBodyJSON } from 'kern-util';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZutatService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<ZutatBodyJSON[]> {
    return this.httpClient.get<ZutatBodyJSON[]>(`${environment.apiUrl}/zutaten`)
  }
}
