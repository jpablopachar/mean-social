import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { User } from '../../models/user';
import { Global } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
  public url: string;
  public filesToUpload: Array<File>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService
  ) {
    this.title = 'Update my data';
    this.user = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.identity = this.user;
    this.url = Global.url;
  }

  ngOnInit() {
    console.log('Component app-user-edit loaded');
  }

  onSubmit() {
    this._userService.updateUser(this.user).subscribe(response => {
      if (!response.user) {
        this.status = 'error';
      } else {
        this.status = 'success';

        // Update the element of the localStorage
        localStorage.setItem('identity', JSON.stringify(this.user));

        // Update the identity property
        this.identity = this.user;

        // Upload of user image
        this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
          .then((result: any) => {
            console.log(result);

            this.user.image = result.image;

            localStorage.setItem('identity', JSON.stringify(this.user));
          });
      }
    }, error => {
      const errorMessage = <any>error;

      console.log(errorMessage);

      if (errorMessage != null) {
        this.status = 'error';
      }
    });
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }
}
