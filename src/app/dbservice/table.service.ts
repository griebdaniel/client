import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod } from '@angular/http';
import * as request from 'request';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TableService {
  localUrl = 'http://localhost:3000/';
  serverUrl = 'http://mossrl.ro.lt/api/';
  baseUrl;

  constructor(private http: Http) {
    this.baseUrl = this.localUrl;
    // this.baseUrl = this.serverUrl;
  }

  public async modify(collection, modifications): Promise<any> {
    const data = {
      collection: collection,
      modifications: modifications
    };

    const header = {
      url: this.baseUrl + 'modify',
      method: 'POST',
      json: data,
      withCredentials: true,
    };

    return new Promise((resolve, reject) => {
      request(header, (err, res, body) => {
        this.find(collection, {}, {}).then(result => {
          resolve(result);
        });
      });
    });
  }

  public find(collection, filter, projection): Promise<any> {
    const data = {
      collection: collection,
      filter: filter,
      projection: projection ? projection : {}
    };

    const header = {
      url: this.baseUrl + 'find',
      method: 'POST',
      json: data,
      withCredentials: true,
    };

    return new Promise((resolve, reject) => {
      request(header, (err, res, body) => {
        resolve(body);
      });
    });
  }

  public isLoggedIn(): Promise<any> {
    const header = {
      url: this.baseUrl + 'isLoggedIn',
      method: 'POST',
    };

    return new Promise((resolve, reject) => {
      request(header, (err, res, body) => {
        resolve(body);
      });
    });
  }

  public login(username, password): Promise<any> {
    const data = {
      username: username,
      password: password,
    };

    const header = {
      url: this.baseUrl + 'login',
      method: 'POST',
      json: data,
      withCredentials: true,
    };

    return new Promise((resolve, reject) => {
      request(header, (err, res, body) => {
        resolve(body);
      });
    });
  }

  public logout() {
    const data = {
    };

    const header = {
      url: this.baseUrl + 'logout',
      method: 'POST',
      json: data,
      withCredentials: true,
    };

    return new Promise((resolve, reject) => {
      request(header, (err, res, body) => {
        resolve(body);
      });
    });
  }

  public insert(collection, doc): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = {
        collection: collection,
        doc: doc
      };
      const header = {
        url: this.baseUrl + 'insert',
        method: 'PUT',
        json: data
      };

      request(header, (err, res, body) => {

      });
    });
  }

  public update(collection: string, olddoc: object, newdoc: object): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = {
        collection: collection,
        olddoc: olddoc,
        newdoc: newdoc
      };

      const header = {
        url: this.baseUrl + 'update',
        method: 'POST',
        json: data
      };

      request(header, (err, res, body) => {

      });
    });
  }

  public deleteOne(collection: string, doc: object): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = {
        collection: collection,
        doc: doc
      };

      const header = {
        url: this.baseUrl + 'delete',
        method: 'DELETE',
        json: data
      };

      request(header, (err, res, body) => {
      });
    });
  }

  public getNecessary(): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = {

      };

      const header = {
        url: this.baseUrl + 'getNecessary',
        method: 'POST',
        json: data,
        withCredentials: true,
      };

      request(header, (err, res, body) => {
        resolve(body);
      });
    });
  }

  public getMachineNecessary(): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = {

      };

      const header = {
        url: this.baseUrl + 'getMachineNecessary',
        method: 'POST',
        json: data,
        withCredentials: true,
      };

      request(header, (err, res, body) => {
        resolve(body);
      });
    });
  }

  public getNecessaryAsCSV(selectedProductOrder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = {
        selectedProductOrder: selectedProductOrder,
      };

      const header = {
        url: this.baseUrl + 'getNecessaryAsCSV',
        method: 'POST',
        json: data,
        withCredentials: true,
      };

      request(header, (err, res, body) => {
        resolve(body);
      });
    });
  }

  public getPrice(): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = {
      };

      const header = {
        url: this.baseUrl + 'getPrice',
        method: 'POST',
        json: data,
        withCredentials: true,
      };

      request(header, (err, res, body) => {
        resolve(body);
      });
    });
  }

  public getCounter() {
    return new Promise((resolve, reject) => {

      const header = {
        url: this.baseUrl + '/',
        method: 'GET',
      };

      request(header, (err, res, body) => {
        resolve(body);
      });
    });
  }

}
