import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Global } from '../../../services/global';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { FollowService } from '../../../services/follow.service';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css'],
  providers: [MessageService, UserService, FollowService]
})
export class ReceivedComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public messages: Message[];
  public message: Message;
  public page;
  public pages;
  public total;
  public nextPage;
  public prevPage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService,
    private _userService: UserService,
    private _messageService: MessageService
  ) {
    this.title = 'Received messages';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.message = new Message('', '', '', '', this.identity._id, '');
  }

  ngOnInit() {
    console.log('Component app-received loaded');
    this.actualPage();
  }

  getMessages(token, page) {
    this._messageService.getMyMessages(token, page).subscribe(response => {
      if (response.messages) {
        this.messages = response.messages;
        this.status = 'success';
        this.total = response.total;
        this.pages = response.pages;
      }
    }, error => {
      const errorMessage = <any>error;

      console.log(errorMessage);

      if (errorMessage) {
        this.status = 'error';
      }
    });
  }

  actualPage() {
    this._route.params.subscribe(params => {
      let page = +params['page'];
      this.page = page;

      if (!params['page']) {
        page = 1;
      }

      if (!page) {
        page = 1;
      } else {
        this.nextPage = page + 1;
        this.prevPage = page - 1;

        if (this.prevPage <= 0) {
          this.prevPage = 1;
        }
      }
      // Return list of messages
      this.getMessages(this.token, this.page);
    });
  }
}

