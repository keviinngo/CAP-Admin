import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private path = 'http://127.0.0.1:8000/'
  private header = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  getToken<Observable>(username: string, password: string) {
    return this.http.post<Token>(this.path + 'token/', 
    `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`,
    this.header
    )
  }
}

export class Token {
  access_token: string
  token_type: string
}