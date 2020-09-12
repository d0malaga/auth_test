import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MessageService } from '../message.service';
import { Member } from '../member';
import { members } from '../mock-members';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members = members

  constructor(
    private memberService: MemberService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
  }

  modify() {
    this.messageService.add('Todo: modify member');
  }

  refresh() {
    // Need to subscribe to asynch Observable data
    this.memberService.getMembers().subscribe(members => this.members = members);
    this.messageService.add('Refresh: ' + JSON.stringify(this.members));
  }

}