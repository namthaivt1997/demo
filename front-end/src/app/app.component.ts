import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http : HttpClient) {
  }

  test(){
    return this.http.get("/app").subscribe(data=>{},error => {
      console.log(error);
    })
  }
}
