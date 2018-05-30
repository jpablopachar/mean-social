import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { Global } from '../../services/global';

@Component({
  selector: 'app-followed',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.css'],
  providers: [UserService, FollowService]
})
export class FollowedComponent implements OnInit {
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
  public followed;
  public followUserOver;
  public status: string;
  public userPageId;
  public user: User;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = 'Followers of ';
    this.url = Global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    console.log('Component app-followed loaded');
    this.actualPage();
  }

  getFollowed(userId, page) {
    this._followService.getFollowed(this.token, userId, page).subscribe(response => {
      if (!response.follows) {
        this.status = 'error';
      } else {
        this.total = response.total;
        this.followed = response.follows;
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

  getUser(userId, page) {
    this._userService.getUser(userId).subscribe(response => {
      if (response.user) {
        this.user = response.user;

        this.getFollowed(userId, page);
      } else {
        this._router.navigate(['/home']);
      }
    }, error => {
      const errorMessage = <any>error;

      console.log(errorMessage);

      if (errorMessage != null) {
        this.status = 'error';
      }
    });
  }

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

  unfollowUser(followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(response => {
      const search = this.follows.indexOf(followed);

      if (search !== -1) {
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
  mouseEnter(userId) {
    this.followUserOver = userId;
  }

  mouseLeave(user_id) {
    this.followUserOver = 0;
  }

  actualPage() {
    this._route.params.subscribe(params => {
      const userId = params['id'];
      let page = +params['page'];

      this.userPageId = userId;
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
      this.getUser(userId, page);
    });
  }
}
