import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Global } from './global';
// import { Follow } from '../models/follow';

@Injectable()
export class FollowService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = Global.url;
  }

  addFollow(token, follow): Observable<any> {
    const params = JSON.stringify(follow);
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'follow', params, { headers: headers });
  }

  deleteFollow(token, id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.delete(this.url + 'follow/' + id, { headers: headers });
  }

  getFollowing(token, userId = null, page = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let url = this.url + 'following';

    if (userId != null) {
      url = this.url + 'following/' + userId + '/' + page;
    }

    return this._http.get(url, { headers: headers });
  }

  getFollowed(token, userId = null, page = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let url = this.url + 'followed';

    if (userId != null) {
      url = this.url + 'followed/' + userId + '/' + page;
    }

    return this._http.get(url, { headers: headers });
  }

  getMyFollows(token): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'get-my-follows/true', { headers: headers });
  }
}
