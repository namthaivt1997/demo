import {Component, NgModule, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {UserserviceService} from "../userservice.service";
import {EventbusService} from "../eventbus.service";

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
  id: string;
  pw: string;
  islogin = true;
  token: string;

  constructor(private http: HttpClient,
              private router: Router,
              public userService: UserserviceService,
              public eventBusService: EventbusService) { }

  ngOnInit() {

  }

  login() {
    this.eventBusService.pushChange('phu',this.id)
    this.userService.login(this.id,this.pw).subscribe(
      data =>{
        this.token = data.token
        this.islogin = data.isLogin
        if (this.islogin === true) {

          this.router.navigate(['/chatroom']);
        }
      }
    )

  }
}
