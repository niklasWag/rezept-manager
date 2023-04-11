import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LebensmittelBodyJSON } from 'kern-util';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LebensmittelService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<LebensmittelBodyJSON[]> {
    return this.httpClient.get<LebensmittelBodyJSON[]>(`${environment.apiUrl}/lebensmittel`)
  }
}
