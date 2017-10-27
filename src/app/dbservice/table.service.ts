import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod } from '@angular/http';
import * as request from 'request';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TableService {
  localUrl = 'http://localhost:3000/';
  serverUrl = 'http://mossrl.ml/api/';
  baseUrl;


  constructor(private http: Http) {
    this.baseUrl = this.localUrl;
    // this.baseUrl = this.serverUrl;
  }

  public modify(collection, modifications) {
    const data = {
      collection: collection,
      modifications: modifications
    };

    const header = {
      url: this.baseUrl + 'modify',
      method: 'POST',
      json: data
    };

    console.log(modifications);

    return new Promise((resolve, reject) => {
      request(header, (err, res, body) => {
        console.log(body);
        resolve(body);
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
      json: data
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

}
