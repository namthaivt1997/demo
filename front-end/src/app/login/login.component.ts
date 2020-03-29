import {Component, NgModule, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppComponent} from "../app.component";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {Router} from "@angular/router";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit {
  id: any;
  pw: any;
  islogin: boolean = true
  token: string

  constructor(private http : HttpClient,
              private router: Router) { }

  ngOnInit() {
  }

  login() {
    if(this.id == null && this.pw == null) {
      return
    }

    // return this.http.post<any>("/app/login", {id:this.id,pw:this.pw}).subscribe(data=>{
    //   console.log("data:",data)
    //    this.islogin = data.isLogin
    //    this.token = data.token
    //
    // },error => {
    //   console.log(error);
    // })

    if(this.islogin == true){
      this.router.navigate(["/chatroom"])
    }
  }
}
