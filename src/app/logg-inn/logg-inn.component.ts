import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService, Token } from '../api.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tokenName } from '@angular/compiler';

@Component({
  selector: 'app-logg-inn',
  templateUrl: './logg-inn.component.html',
  styleUrls: ['./logg-inn.component.css']
})
export class LoggInnComponent implements OnInit {
  loginForm;
  apiService;
  token: Observable<Token>;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });

    this.apiService = new ApiService(http);
   }

  ngOnInit(): void {
  }

  async onSubmit(data: FormData) {
    this.token = this.apiService.getToken(data['username'], data['password']);
    this.token.subscribe(data => {
      console.log(data.access_token);
    });
    this.loginForm.reset();
  }
}