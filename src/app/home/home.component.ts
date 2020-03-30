import { Component, OnInit, Inject } from '@angular/core';
import { ApiService, DeckAll , DeckNoCards, Card} from '../api.service';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allDecks: DeckNoCards[];
  deck = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private _http: HttpClient,
    public dialog: MatDialog
  ) { }

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
      });
  }

  showDeck(id: number): void {
    this.deck = this.apiService.getDeck(id).subscribe( deck => {
      this.deck = deck;
    });
  }

  editCard(card: Card): void {
    const dialogRef = this.dialog.open(EditCardDialog, {
      width: '250px',
      data: card
    });
  }
}

@Component({
  selector: 'edit-card-dialog',
  templateUrl: 'edit-card-dialog.html',
})
export class EditCardDialog {
  constructor(
    public dialogRef: MatDialogRef<EditCardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Card) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}


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

/*
interface Deck {
  value: string;
  viewValue: string;
  //content: string;
}
*/
