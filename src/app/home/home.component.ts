import { Component, OnInit, Inject } from '@angular/core';
import { ApiService, DeckAll , DeckNoCards, Card, Deck, CardPutt, DeckPutt} from '../api.service';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allDecks: DeckNoCards[];
  searchedDecks: DeckNoCards[];
  searchedCards: Card[];
  deck: Deck = null;
  deckSearchTerm: string;
  cardSearchTerm: string;

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
        this.searchedDecks = this.allDecks;
      });
  }

  showDeck(id: number): void {
    this.apiService.getDeck(id).subscribe( deck => {
      this.deck = deck;
      this.searchedCards = this.deck.cards;
    });
  }

  deckSearch(value: string): void {
    if(value != "") {
      this.searchedDecks = this.allDecks.filter(deck => deck.title.toLowerCase().includes(value.toLowerCase()))
      console.log(value);
    } else {
      this.searchedDecks = this.allDecks;
    }
  }

  cardSearch(value: string): void {
    if(value != "") {
      this.searchedCards = this.deck.cards.filter(card => card.text.toLowerCase().includes(value.toLowerCase()))
    } else {
      this. searchedCards = this.deck.cards;
    }
  }

  editCard(selectedCard: Card): void {
    const dialogRef = this.dialog.open(EditCardDialog, {
      data: {id: selectedCard.id, text: selectedCard.text, blanks: selectedCard.blanks}
    });

    dialogRef.afterClosed().subscribe(data => {
      let putCard = new CardPutt();
      putCard.text = data.text;
      putCard.blanks = data.blanks;
      // Create new card
      let newCard: Card;
      this.apiService.putCardCallback(putCard, ((cardFromPut) => {
        newCard = cardFromPut;
        // Remove the old card from the deck
        this.apiService.patchDeckRemoveCard(this.deck.id, selectedCard.id).subscribe((deck) => {
          // Add the new card to the deck
          this.apiService.patchDeckAddCard(this.deck.id, newCard.id).subscribe((deck) => {
            // Update the deck array and the currently selected deck
            this.apiService.getDecks().subscribe(decks => {
              this.allDecks = decks['decks'];
              this.showDeck(this.deck.id);
            });
          });
        });
      }));
    });
  }

  deleteCard(selectedCard: Card): void {
    this.apiService.patchDeckRemoveCard(this.deck.id, selectedCard.id).subscribe(deck => {
      console.log("Card deleted from deck");
      this.deck = deck;
      this.cardSearch(this.cardSearchTerm);
      this.apiService.getDecks().subscribe((decks) => {this.allDecks = decks['decks']});
    });
  }


  deleteDeck(selectedDeck: Deck): void {
    this.apiService.deleteDeck(selectedDeck.id).subscribe(deletedDeck => {}); //TODO: maybe do something with the data idk.
  }


  createNewCard(newCard: CardPutt): void {
    this.apiService.putCard(newCard).subscribe(createdCard => {}); //TODO: Do something with the newly made card
  }


  createNewDeck(newDeck: DeckPutt): void {
    this.apiService.putDeck(newDeck).subscribe(createdDeck => {}) //TODO: Do something with the created deck
  }

  //TODO: Add function for importing a deck from another website
  importDeck(deckID: number): void {
    this.apiService.getCardCastDeckInfo(deckID).subscribe(info => {}) //TODO: continue
  }

}


@Component({
  selector: 'edit-card-dialog',
  templateUrl: 'edit-card-dialog.html',
})
export class EditCardDialog {
  constructor(
      public dialogRef: MatDialogRef<EditCardDialog>,
      @Inject(MAT_DIALOG_DATA) public data: Card
    ) {}

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
