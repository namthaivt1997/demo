// @ts-ignore
import {Component, OnInit} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {EventbusService} from "../eventbus.service";
import {CookieService} from 'ngx-cookie-service';
import {myarray} from "./myarray";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})







export class ChatroomComponent implements OnInit {
  isLogin: boolean = false
  array: myarray[]
  token: string
  user: string;
  msgnew: string;
  msg: string[] = [];
  url: any
  listroom = []
  select : any

  constructor(public eventbusService: EventbusService,
              public cookie: CookieService,
              private http: HttpClient,
              private router: Router,) {
  }


  getToken(){
    this.eventbusService.listenChange<string>("phu").subscribe(r => {
      this.token = r
      this.http.get("app/chatroom",{'headers': new HttpHeaders()
          .set('Authorization', 'Bearer ' + this.token)}

      ).subscribe(data => {

      },error => {
        this.router.navigate(['/']);
        console.log(error)
      });

    });



  }
  sendToServer($event) {
    console.log("msg send to server: " + this.user + this.msgnew + this.select)
    this.url.next(this.user + this.msgnew + this.select);
  }

  ngOnInit(): void {
    this.getToken()
    this.url = webSocket({url:'ws://localhost:1323/a/ws',
      // protocol: ['Authorization', 'Bearer ' + this.token]
    });

    this.user = this.cookie.get("username")
    console.log(">>>>>>>>", this.token)
    this.getlistroom()
    this.url.subscribe(msg => {
      console.log('message received: ' + msg);
      console.log('msg:' + msg);

      this.msg.push(msg.toString());
      //this.array.push({id:this.user,msg:msg})
    }, error => {
      console.log(error);
    });
  }


  getlistroom() {
    this.http.get("app/chatroom/listroom/"+this.user,{'headers': new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)}

    ).subscribe(data => {

      this.listroom = data.listroom
      console.log(this.listroom)
    },error => {
    });
  }

  selectRoom(room: any) {
    this.select = room
    this.http.get("app/chatroom/selectroom/"+room,{'headers': new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)}

    ).subscribe(data => {

    },error => {
    });
  }
}
