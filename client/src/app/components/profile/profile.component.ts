import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;
  public stats;
  public url;
  public followed;
  public following;
  public followUserOver;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = 'Profile';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.followed = false;
    this.following = false;
  }

  ngOnInit() {
    console.log('Component app-profile loaded');
    this.loadPage();
  }

  loadPage() {
    this._route.params.subscribe(params => {
      const id = params['id'];

      this.getUser(id);
      this.getCounters(id);
    });
  }

  getUser(id) {
    this._userService.getUser(id).subscribe(response => {
      if (response.user) {
        this.user = response.user;

        // Comprobar si sigo a este usuario
        if (response.following && response.following._id) {
          this.following = true;
        } else {
          this.following = false;
        }

        // Comprobar si me está siguiendo este usuario
        if (response.followed && response.followed._id) {
          this.followed = true;
        } else {
          this.followed = false;
        }
      } else {
        this.status = 'error';
      }
    }, error => {
      console.log(<any>error);
      this._router.navigate(['/profile', this.identity._id]);
    });
  }

  getCounters(id) {
    this._userService.getCounters(id).subscribe(response => {
      this.stats = response;
    }, error => {
      console.log(<any>error);
    });
  }

  // Metodo para seguir a un usuario
  followUser(followed) {
    const follow = new Follow('', this.identity._id, followed);
    console.log(follow);

    this._followService.addFollow(this.token, follow).subscribe(response => {
      this.following = true;
    }, error => {
      console.log(<any>error);
    });
  }

  // Método para dejar de seguir a un usuario
  unfollowUser(followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(response => {
      this.following = false;
    }, error => {
      console.log(<any>error);
    });
  }

  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }

  mouseLeave() {
    this.followUserOver = 0;
  }
}
