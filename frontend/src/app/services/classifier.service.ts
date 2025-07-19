import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassifierService {
  private predictUrl = 'http://127.0.0.1:8000/api/predict/';
  private iterpretUrl = 'http://127.0.0.1:8000/llm/analysis/';

  constructor(private http: HttpClient) {}

  classify(payload: any): Observable<any> {
    return this.http.post<any>(this.predictUrl, payload);
  }

  interpret(payload: any): Observable<any> {
    return this.http.post<any>(this.iterpretUrl, payload);
  }
}
