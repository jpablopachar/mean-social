import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { FollowService } from '../../../services/follow.service';
import { MessageService } from '../../../services/message.service';
import { Follow } from '../../../models/follow';
import { Message } from '../../../models/message';
import { Global } from '../../../services/global';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [FollowService, MessageService]
})
export class AddComponent implements OnInit {
  public title: string;
  public message: Message;
  public identity;
  public token;
  public url: string;
  public status: string;
  public follows;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService,
    private _messageService: MessageService
  ) {
    this.title = 'Send message';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.message = new Message('', '', '', '', this.identity._id, '');
  }

  ngOnInit() {
    console.log('Component app-add loaded');
    this.getMyFollows();
  }

  onSubmit(form) {
    console.log(this.message);

    this._messageService.addMessage(this.token, this.message).subscribe(response => {
      if (response.message) {
        this.status = 'success';

        form.reset();
      }
    }, error => {
      this.status = 'error';
      console.log(<any>error);
    });
  }

  getMyFollows() {
    this._followService.getMyFollows(this.token).subscribe(response => {
      this.follows = response.follows;
    }, error => {
      console.log(<any>error);
    });
  }
}
