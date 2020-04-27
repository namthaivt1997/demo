// @ts-ignore
import {Component, OnInit} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {EventbusService} from "../eventbus.service";
import {CookieService} from 'ngx-cookie-service';
import {myarray} from "./myarray";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {usermsg} from "./usermsg";

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})







export class ChatroomComponent implements OnInit {
  useronline: myarray[] = []
  token: string
  msgnew: string;
  msg: usermsg[] = [];
  url: any

  constructor(public eventbusService: EventbusService,
              public cookie: CookieService,
              private http: HttpClient,
              private router: Router,) {
  }




  getToken(){
      this.eventbusService.listenChange<string>("phu").subscribe(r => {
        this.token = r
      });



  }
  sendToServer($event) {
    this.url.next(this.msgnew );
  }

  ngOnInit(): void {
    var t = this.eventbusService.t
    console.log("tttttttttt",t)
    this.getToken()
    this.http.get("/app/chatroom/", {
        'headers': new HttpHeaders()
          .set('Authorization', 'Bearer ' + t)
      }
    ).subscribe(data => {
      data.usersonline.forEach(r => {
        this.useronline.push(r)
      })
      console.log("???????????",this.useronline)
    }, error => {
      this.router.navigate(['/']);
      console.log(error)
    });
    this.url = webSocket({url:'ws://localhost:1323/ws',
       //protocol: ['Authorization', 'Bearer ' + this.token]
    });
    console.log(">>>>>>>>", this.token)
    //this.getlistroom()

    this.url.subscribe(msg => {
      msg = msg.split(":",2)
      console.log("arr msg",msg)
      this.msg.push({
        user : msg[0].toString(),
        msg : msg[1].toString()
      });
      //this.array.push({id:this.user,msg:msg})
    }, error => {
      console.log(error);
    });
  }


  // getlistroom() {
  //   this.http.get("app/chatroom/listroom/"+this.user,{'headers': new HttpHeaders()
  //       .set('Authorization', 'Bearer ' + this.token)}
  //
  //   ).subscribe(data => {
  //
  //     this.listroom = data.listroom
  //     console.log(this.listroom)
  //   },error => {
  //   });
  // }
  //
  // selectRoom(room: any) {
  //   this.select = room
  //   this.http.get("app/chatroom/selectroom/"+room,{'headers': new HttpHeaders()
  //       .set('Authorization', 'Bearer ' + this.token)}
  //
  //   ).subscribe(data => {
  //
  //   },error => {
  //   });
  // }
}
