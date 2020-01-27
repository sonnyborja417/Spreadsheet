import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MathField } from '../grid/grid.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  apiURL = 'http://localhost:59114/api';

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  } 
  
  postFormula(mathFieldObject: MathField): Observable<MathField> {
    return this.http.post<MathField>(this.apiURL + '/MathField' , JSON.stringify(mathFieldObject), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  } 

  handleError(error) {
    let errorMessage = 'There was an error in your formula';    
    window.alert(errorMessage);
    return throwError(errorMessage);
 }

}
