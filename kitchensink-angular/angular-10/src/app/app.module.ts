import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Test running without a server
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { RegisterMemberComponent } from './register-member/register-member.component';
import { MemberService } from './member.service';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // RouterModule.forRoot([
      // { path: '', component: MemberListComponent },
      // { path: '/members', component: MemberListComponent },
     //  { path: 'member/:memberId', component: RegisterMemberComponent },
    //])
 ],
  declarations: [ AppComponent, HelloComponent, RegisterMemberComponent, MemberListComponent, MessagesComponent ],
  bootstrap:    [ AppComponent ],
  providers: [MemberService]  
})
export class AppModule { }

// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.
HttpClientInMemoryWebApiModule.forRoot(
  InMemoryDataService, { dataEncapsulation: false }
)
