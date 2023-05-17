import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:3000/templates';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpClient) { }

  getAllTemplate(filter: object): Observable<any> {
    let params = new HttpParams()
      .append('filter', JSON.stringify(filter));
    return this.http.get(baseUrl, {params});
  }

  getATemplate(id: string): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  postATemplate(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  updateTemplateById(id: string, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  deleteTemplateById(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  generateATemplate(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/generate`, data);
    //return this.http.post(`http://api.labelary.com/v1/printers/${data.dpmm}dpmm/labels/${data.width}x${data.height}/${data.index}/`, data.zplcode);
  }
}
