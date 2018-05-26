import { Injectable } from '@angular/core';

import { Global } from './global';

@Injectable()
export class UploadService {
  public url: string;

  constructor() {
    this.url = Global.url;
  }

  // Method that allows images to be sent
  makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData(); // Data Form
      const xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append(name, files[i], files[i].name);
      }

      // AJAX Petition
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }
}
