
// @ts-ignore
import {Component, OnInit} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {EventbusService} from "../eventbus.service";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})




export class ChatroomComponent implements OnInit {

  constructor( public eventbusService : EventbusService,
               public cookie : CookieService) {

  }

  user: string;
  msgnew: string;
  msg: string[] = [];

  url: any


  sendToServer($event) {


    this.url.next(this.user+this.msgnew);

    console.log(this.msg);
  }

  ngOnInit(): void {
    this.eventbusService.listenChange<string>("phu").subscribe(r => {
      this.user = r
      console.log('phu', r);
    });

    this.url =  webSocket('ws://localhost:1323/ws');

    this.url.subscribe(msg => {console.log('message received: ' + msg);
                               console.log('msg:' +  msg);
                               this.msg.push(msg.toString());
    });

    this.cookie.set("thai","1111")
    this.user = this.cookie.get("username")
    console.log(">>>>>>>>",this.user)
  }
}
