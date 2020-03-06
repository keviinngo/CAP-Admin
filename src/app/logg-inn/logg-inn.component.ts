import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService, Token } from '../api.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logg-inn',
  templateUrl: './logg-inn.component.html',
  styleUrls: ['./logg-inn.component.css']
})
export class LoggInnComponent implements OnInit {
  loginForm: FormGroup;
  token: string;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
   }

  ngOnInit(): void {
    this.apiService.getCurrentUser(user => {
      if (user) {
        this.router.navigateByUrl('/home')
      } 
    })
  }

  onSubmit(data: FormData) {
    this.apiService.logInn(data['username'], data['password'], (data) => {
      if(data) {
        this.router.navigateByUrl('/home');
      }
    });
    this.loginForm.reset();
  }
}