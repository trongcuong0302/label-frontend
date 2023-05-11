import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:3000/labels';

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  constructor(private http: HttpClient) { }

  getAllTemplate(filter: object): Observable<any> {
    let params = new HttpParams()
      .append('filter', JSON.stringify(filter));
    return this.http.get(baseUrl, {params});
  }

  generateALabel(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/generate`, data);
    //return this.http.post(`http://api.labelary.com/v1/printers/${data.dpmm}dpmm/labels/${data.width}x${data.height}/${data.index}/`, data.zplcode);
  }
}
