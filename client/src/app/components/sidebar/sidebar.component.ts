import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';
import { Global } from '../../services/global';
import { Publication } from '../../models/publication';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit {
  public identity;
  public token;
  public stats;
  public url: string;
  public status;
  public publication: Publication;
  public filesToUpload: Array<File>;

  // Output
  @Output() sended = new EventEmitter();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _uploadService: UploadService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = Global.url;
    this.publication = new Publication('', '', '', '', this.identity._id);
  }

  ngOnInit() {
    console.log('Component app-sidebar loaded');
  }

  onSubmit(form) {
    this._publicationService.addPublication(this.token, this.publication).subscribe(response => {
      if (response.publication) {
        // this.publication = response.publication;
        // Subir imagen
        if (this.filesToUpload && this.filesToUpload.length) {
          this._uploadService.makeFileRequest(this.url + 'upload-image-pub/' +
            response.publication._id, [], this.filesToUpload, this.token, 'image').then((result: any) => {
            this.status = 'success';
            this.publication.file = result.image;

            form.reset();
            this._router.navigate(['/timeline']);
            this.sended.emit({send: 'true'});
          });
        } else {
          this.status = 'success';

          form.reset();
          this._router.navigate(['/timeline']);
          this.sended.emit({send: 'true'});
        }
      } else {
        this.status = 'error';
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
  }

  sendPublication(event) {
    console.log(event);
    this.sended.emit({ send: 'true' });
  }

}
