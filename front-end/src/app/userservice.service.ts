import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {



  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return new Observable<any>((subscriber) => {
      const sub = this.http.post<any>("/app/login",{id:username,pw:password} , {
        'headers': new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(
        (res: any) => {

          subscriber.next(res);
        },
        (err) => {

          subscriber.error(err)
        },
        () => subscriber.complete(),
      );
      return () => sub.unsubscribe();
    });
  }

}
