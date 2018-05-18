import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
    this.title = 'Identify';
    this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit() {
    console.log('Component app-login loaded!');
  }

  // Log the user and get their data
  onSubmit() {
    this._userService.signUp(this.user).subscribe(response => {
      this.identity = response.user;

      if (!this.identity || !this.identity._id) {
        this.status = 'error';
      } else {
        // Persist user data and convert to String
        localStorage.setItem('identity', JSON.stringify(this.identity));
        // Get the token
        this.getToken();
      }
    }, error => {
      const errorMessage = <any>error;

      if (errorMessage != null) {
        this.status = 'error';
      }
    });
  }

  getToken() {
    this._userService.signUp(this.user, 'true').subscribe(response => {
      this.token = response.token;

      if (this.token.length <= 0) {
        this.status = 'error';
      } else {
        // Persist the user's token
        localStorage.setItem('token', this.token);
        // Get the counters or statistics of the user
        this.getCounters();
      }
    }, error => {
      const errorMessage = <any>error;

      console.log(errorMessage);

      if (errorMessage != null) {
        this.status = 'error';
      }
    });
  }

  getCounters() {
    this._userService.getCounters().subscribe(response => {
      localStorage.setItem('stats', JSON.stringify(response));
      this.status = 'success';

      this._router.navigate(['/']);
    }, error => {
      console.log(<any>error);
    });
  }
}
