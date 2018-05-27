import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { Global } from '../../services/global';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService, FollowService]
})
export class UserComponent implements OnInit {
  public title: string;
  public url: string;
  public identity;
  public token;
  public page;
  public nextPage;
  public prevPage;
  public total;
  public pages;
  public users: User[];
  public follows;
  public followUserOver;
  public status: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = 'People';
    this.url = Global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    console.log('Component app-users loaded');
    this.actualPage();
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
      // Return list of users
      this.getUsers(page);
    });
  }

  getUsers(page) {
    this._userService.getUsers(page).subscribe(response => {
      if (!response.users) {
        this.status = 'error';
      } else {
        this.total = response.total;
        this.users = response.users;
        this.pages = response.pages;
        this.follows = response.usersFollowing;

        if (page > this.pages) {
          this._router.navigate(['/people', 1]);
        }
      }
    }, error => {
      const errorMessage = <any>error;

      console.log(errorMessage);

      if (errorMessage != null) {
        this.status = 'error';
      }
    });
  }

  mouseEnter(userId) {
    this.followUserOver = userId;
  }

  mouseLeave(userId) {
    this.followUserOver = 0;
  }

  // Follow a user
  followUser(followed) {
    const follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(response => {
      if (!response.follow) {
        this.status = 'error';
      } else {
        this.status = 'success';
        this.follows.push(followed);
      }
    }, error => {
      const errorMessage = <any>error;

      console.log(errorMessage);

      if (errorMessage != null) {
        this.status = 'error';
      }
    });
  }

  // Stop following a user
  unfollowUser(followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(response => {
      // Search followed in the array of follows
      const search = this.follows.indexOf(followed);

      if (search !== -1) {
        // Remove the item that you found
        this.follows.splice(search, 1);
      }
    }, error => {
      const errorMessage = <any>error;

      console.log(errorMessage);

      if (errorMessage != null) {
        this.status = 'error';
      }
    });
  }
}
