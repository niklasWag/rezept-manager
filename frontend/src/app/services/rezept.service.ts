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
}
