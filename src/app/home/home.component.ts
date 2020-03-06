import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {  
    this.apiService.getCurrentUser(user => {
      if (user) {
        console.log(`Welcome ${user.username}!`);
      } else {
        this.router.navigateByUrl('/');
      }
    })
  }
}
