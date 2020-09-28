import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Test running without a server
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MemberService } from './member.service';
import { MemberListComponent } from './member-list/member-list.component';
import { RegisterMemberComponent } from './register-member/register-member.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  imports:      [ 
    BrowserModule, 
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: MemberListComponent },
      { path: 'regmember/:memberId', component: RegisterMemberComponent },
    ])
 ],
  declarations: [
    AppComponent,
    TopBarComponent,
    RegisterMemberComponent,
    MemberListComponent,
    MessagesComponent
  ],
  bootstrap:    [ AppComponent ],
  providers: [
    MemberService,
    {provide: APP_BASE_HREF, useValue: '/kitchensink-angular'}
  ]  
})
export class AppModule { }

// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.
//HttpClientInMemoryWebApiModule.forRoot(
//  InMemoryDataService, { dataEncapsulation: false }
// )
