import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import { ChatroomComponent } from './chatroom/chatroom.component';
import {RouterModule, Routes} from "@angular/router";


const appRoutes: Routes = [
  // { path: 'crisis-center', component: CrisisListComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'chatroom',
    component: ChatroomComponent,
    data: { title: 'Room Chat' }
  },
  { path: '',
    //redirectTo: '/',
    component: LoginComponent,
    pathMatch: 'full'
  },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatroomComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,

    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
