import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Global } from '../../services/global';
import { Publication } from '../../models/publication';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {
  public identity;
  public token;
  public title: string;
  public url: string;
  public status: string;
  public page;
  public total;
  public pages;
  public itemsPerPage;
  public noMore = false;
  public publications: Publication[];
  @Input() user: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.title = 'Publications';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    this.url = Global.url;
    this.page = 1;
  }

  ngOnInit() {
    console.log('Component app-publications loaded');
    this.getPublications(this.user, this.page);
  }

  getPublications(user, page, adding = false) {
    this._publicationService.getPublicationsUser(this.token, user, page).subscribe(response => {
      if (response.publications) {
        this.total = response.totalItems;
        this.pages = response.pages;
        this.itemsPerPage = response.itemsPerPage;

        if (!adding) {
          this.publications = response.publications;
        } else {
          const arrayA = this.publications;
          const arrayB = response.publications;

          this.publications = arrayA.concat(arrayB);

          // $('html, body').animate({scrollTop: $('html').prop('scrollHeight')}, 500);
        }

        if (page > this.pages) {
          //   this._router.navigate(['/home']);
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

  viewMore() {
    // console.log(this.publications.length);
    // console.log(this.total - this.itemsPerPage);
    if (this.page === this.pages) {
      this.noMore = true;
    }

    this.getPublications(this.user, this.page, true);
  }
}
