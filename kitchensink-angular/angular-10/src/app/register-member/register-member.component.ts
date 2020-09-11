import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MessageService } from '../message.service';
import { Member } from '../member';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-register-member',
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.css']
})
export class RegisterMemberComponent implements OnInit {

  registerForm;

  constructor(
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
    this.messageService.add("Todo - Register:" + memberData.name + ", "+ memberData.email + ", " + memberData.phoneNumber);
    // window.alert("Register:" + memberData.name + ", "+ memberData.email + ", " + memberData.phoneNumber);

    memberData.name.trim();
    if (!memberData.name) { return; }
    // const  newMember:Member = new Member(-1, memberData.name, memberData.email,memberData.phoneNumber);

    // this.memberService.updateMember({ newMember } as Member)
    //   .subscribe(member => {
    //        this.messageService.add('The new user has been registered' + memberData);
    //  });
    this.registerForm.reset();
  }
}