import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Global } from '../../services/global';
import { Publication } from '../../models/publication';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {
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
  public showImage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.page = 1;
  }

  ngOnInit() {
    console.log('Component app-timeline loaded');
    this.getPublications(this.page);
  }

  getPublications(page, adding = false) {
    this._publicationService.getPublications(this.token, page).subscribe(response => {
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
    this.page += 1;

    if (this.page === this.pages) {
      this.noMore = true;
    }

    this.getPublications(this.page, true);
  }

  refresh(event = null) {
    this.getPublications(1);
  }

  showThisImage(id) {
    this.showImage = id;
  }

  hideThisImage(id) {
    this.showImage = 0;
  }

  deletePublication(id) {
    this._publicationService.deletePublication(this.token, id).subscribe(response => {
      this.refresh();
    }, error => {
      console.log(<any>error);
    });
  }
}
