import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService, Token } from '../api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-logg-inn',
  templateUrl: './logg-inn.component.html',
  styleUrls: ['./logg-inn.component.css']
})
export class LoggInnComponent implements OnInit {
  loginForm: FormGroup;
  token: Observable<Token>;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
  ) {
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });

   }

  ngOnInit(): void {
  }

  async onSubmit(data: FormData) {
    this.token = this.api.getToken(data['username'], data['password']);
    this.token.subscribe(data => {
      console.log(data.access_token);
    });
    this.loginForm.reset();
  }
}