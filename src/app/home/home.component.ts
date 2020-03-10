import { Component, OnInit } from '@angular/core';
import { ApiService, DeckAll , DeckNoCards} from '../api.service';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  

  allDecks: DeckNoCards[];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private _http: HttpClient
  ) { }

  /*
  selectedValue: string;
  selectedContent: string;content: 'This is __'content: 'My name is __'

  
  decks: Deck[] = [
    {value: 'Fun Deck', viewValue: 'Test', },
    {value: 'Crazy Deck', viewValue: 'TestTest', }
  ];
  

  getAllDecks() {
    this.apiService.getDecks()
    .subscribe(
      (decks: any[]) => {
        this.allDecks = decks;
        console.log("Hentet deck");
      },
      error => alert(error)
    )
    
  };
*/
  ngOnInit(): void {
      this.apiService.getCurrentUser(user => {
        if (user) {
          console.log(`Welcome ${user.username}!`);
        } else {
          this.router.navigateByUrl('/');
        }
      });

      //this.getAllDecks;

      this.apiService.getDecks().subscribe(decks => {
        this.allDecks = decks['decks'];
      })
  }

}




/*
interface Deck {
  value: string;
  viewValue: string;
  //content: string;
}
*/
