import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { FollowService } from '../../../services/follow.service';
import { Message } from '../../../models/message';
import { Global } from '../../../services/global';

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css'],
  providers: [MessageService, UserService, FollowService]
})
export class SendedComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url: string;
  public messages: Message[];
  public page;
  public pages;
  public total;
  public next_page;
  public prev_page;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService,
    private _messageService: MessageService
  ) {
    this.title = 'Sent messages';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
  }

  ngOnInit() {
    console.log('Component app-sended loaded');
    this.actualPage();
  }

  getMessages(token, page) {
    this._messageService.getEmmitMessages(token, this.page).subscribe(response => {
      if (response.messages) {
        this.messages = response.messages;
        this.total = response.total;
        this.pages = response.pages;
      }
    }, error => {
      console.log(<any>error);
    });
  }

  actualPage() {
    this._route.params.subscribe(params => {
      let page = +params['page'];
      const user_id = params['id'];

      this.page = page;

      if (!params['page']) {
        page = 1;
      }

      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }
      // Return list of messages
      this.getMessages(this.token, this.page);
    });
  }
}
