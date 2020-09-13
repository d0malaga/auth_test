import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { MessageService } from '../message.service';
import { Member, NewMember } from '../member';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-register-member',
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.css']
})
export class RegisterMemberComponent implements OnInit {
  member;
  registerForm;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private messageService: MessageService
  ) {
    this.registerForm = this.formBuilder.group({
      name: '',
      email: '',
      phoneNumber: ''
    });
  }

  ngOnInit() {
    let mId: number = -1
    this.route.paramMap.subscribe(params => {
      // this.member = members[+params.get('memberId')];
      mId = parseInt(params.get('memberId'));
    });
    // Need to subscribe to asynch Observable data
    if (mId >= 0) {
        this.memberService.getMember(mId).subscribe(member => {
	    this.member = member;
	    this.messageService.add("Called with: " + mId + " -> " + JSON.stringify(this.member));
	    this.set(this.member)
	});
    }
  }

  reset() {
    this.registerForm.reset();
  }

  set(member: Member) {
    // Todo: check if easier way to set form...
    this.registerForm = this.formBuilder.group({
      name: member.name,
      email: member.email,
      phoneNumber: member.phoneNumber
    });
  }

  onSubmit(memberData) {
    memberData.name.trim();
    if (!memberData.name) { return; }
    const  newMember:NewMember = {name:memberData.name, phoneNumber:memberData.phoneNumber, email:memberData.email};

    this.memberService.updateMember(newMember)
      .subscribe(member => {
           this.messageService.add('The new user has been registered: ' + memberData.name);
      });
    this.registerForm.reset();
  }
}