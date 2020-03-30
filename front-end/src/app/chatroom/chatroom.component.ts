import {Component, OnInit} from "@angular/core";
import {webSocket} from "rxjs/webSocket";

@Component({
  selector: "app-chatroom",
  templateUrl: "./chatroom.component.html",
  styleUrls: ["./chatroom.component.css"],
})


type User = {
  id: string
  msg: Array<string>
}

export class ChatroomComponent implements OnInit{


  user: User

  msgold: Array<string> = []
  msgrecive: string
  msg: string = ""
  url = webSocket('ws://localhost:1323/app/ws')

  sendToServer($event) {


    this.url.next(this.msg)

    console.log(this.msgold)
  }

  ngOnInit(): void {
    this.url.subscribe(msg => {console.log('message received: ' + msg)
      console.log("msg:" +  msg)
      this.user.msg = this.user.msg.concat(msg.toString())
    });
  }
}
