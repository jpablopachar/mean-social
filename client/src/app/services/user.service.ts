import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Global } from './global';
import { User } from '../models/user';

@Injectable()
export class UserService {
  public url: string;
  public identity;
  public token;
  public stats;

  constructor(public _http: HttpClient) {
    this.url = Global.url;
  }

  // Register a user
  register(user: User): Observable<any> {
    const params = JSON.stringify(user); // Convert the data to a JSON of type String
    const headers = new HttpHeaders().set('Content-Type', 'application/json'); // Set headers

    // Make the request to the server
    return this._http.post(this.url + 'register', params, { headers: headers });
  }

}
