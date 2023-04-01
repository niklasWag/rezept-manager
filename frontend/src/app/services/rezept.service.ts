import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RezeptBodyJSON } from 'kern-util/lib/domain';

@Injectable({
  providedIn: 'root'
})
export class RezeptService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<RezeptBodyJSON[]> {
    return this.httpClient.get<RezeptBodyJSON[]>(`${environment.apiUrl}/rezepte`)
  }

  post(rezeptJSON: RezeptBodyJSON): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/rezept`, rezeptJSON)
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/rezept/${id}`)
  }

  search(filter: any): Observable<RezeptBodyJSON[]> {
    return this.httpClient.post<RezeptBodyJSON[]>(`${environment.apiUrl}/rezepte/search`, filter)
  }
}
