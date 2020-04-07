import { Component, OnInit, Inject } from '@angular/core';
import { ApiService, DeckAll , DeckNoCards, Card, Deck, CardPutt, DeckPutt} from '../api.service';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { async } from '@angular/core/testing';


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
      this.apiService.getDecks().toPromise().then(decks => {
        this.allDecks = decks['decks'];
        this.searchedDecks = this.allDecks;
      });
  }

  scroll(el: string) {
    document.querySelector(el).scrollIntoView({ behavior: 'smooth' });
  }

  showDeck(id: number): void {
    this.apiService.getDeck(id).toPromise().then( deck => {
      this.deck = deck;
      this.searchedCards = this.deck.cards;
    });
  }

  deckSearch(value: string): void {
    if (value != "") {
      this.searchedDecks = this.allDecks.filter(deck => deck.title.toLowerCase().includes(value.toLowerCase()))
      console.log(value);
    } else {
      this.searchedDecks = this.allDecks;
    }
  }

  cardSearch(value: string): void {
    if (value != "") {
      this.searchedCards = this.deck.cards.filter(card => card.text.toLowerCase().includes(value.toLowerCase()))
    } else {
      this. searchedCards = this.deck.cards;
    }
  }

  editCard(selectedCard: Card): void { //TODO: Handle errors
    const dialogRef = this.dialog.open(EditCardDialog, {
      data: {id: selectedCard.id, text: selectedCard.text, blanks: selectedCard.blanks}
    });

    dialogRef.afterClosed().toPromise().then(data => {
      let putCard = new CardPutt();
      putCard.text = data.text;
      putCard.blanks = data.blanks;
      // Create new card
      let newCard: Card;

      //TODO: make this nicer
      this.apiService.putCardCallback(putCard, ((cardFromPut) => {
        newCard = cardFromPut;
        // Remove the old card from the deck
        this.apiService.patchDeckRemoveCard(this.deck.id, selectedCard.id).toPromise().then((deck) => {
          // Add the new card to the deck
          this.apiService.patchDeckAddCard(this.deck.id, newCard.id).toPromise().then((deck) => {
            // Update the deck array and the currently selected deck
            this.apiService.getDecks().toPromise().then(decks => {
              this.allDecks = decks['decks'];
              this.showDeck(this.deck.id);
            });
          });
        });
      }));
    });
  }

  //TODO: Add dialog box for deleting card
  deleteCard(selectedCard: Card): void { //TODO: Need to handle errors
    this.apiService.patchDeckRemoveCard(this.deck.id, selectedCard.id).toPromise().then(deck => {
      console.log("Card deleted from deck");
      this.deck = deck;
      this.cardSearch(this.cardSearchTerm);
      this.allDecks = this.apiService.getDecks().toPromise()['decks'];
    });
  }


  //TODO: Add dialog box for deleting deck
  deleteDeck(selectedDeck: Deck): void {
    this.apiService.deleteDeck(selectedDeck.id).toPromise().finally(() => {
      this.apiService.getDecks().toPromise().then(decks => {
        this.allDecks = decks['decks'];
        this.searchedDecks = this.allDecks;
      });
    }) //TODO: maybe do something with the data idk.
  }

  createNewCard(newCard: CardPutt): void {
    this.apiService.putCard(newCard).toPromise().then(createdCard => {}); //TODO: Do something with the newly made card
  }


  createNewDeck(newDeck: DeckPutt): void {
    this.apiService.putDeck(newDeck).toPromise().then(createdDeck => {}) //TODO: Do something with the created deck
  }

  //TODO: Add function for importing a deck from another website
  importDeck(deckID: string): void {
    let importedDeck = new DeckPutt();
    importedDeck.cards = []

    this.apiService.getCardCastDeckInfo(deckID).toPromise().then(async info => {
      importedDeck.title = info.name;
      importedDeck.description = info.description;

      let calls = await this.apiService.getCardCastDeckCalls(deckID).toPromise();
      console.log(calls);
      let responses = await this.apiService.getCardCastDeckResponses(deckID).toPromise();
      console.log(responses);

      for (let card of calls) {
        let importedCard: CardPutt =  new CardPutt();
        importedCard.text = "";

        if (card.text.length == 1) {
          importedCard.blanks = 0;
          card.text.forEach(text => {
            importedCard.text += text;
          });

        } else {
          importedCard.blanks = card.text.length - 1;

          card.text.forEach( (text, index) => {
            if (index == 0) {
              importedCard.text += text + "____";
            } else if (index == card.text.length - 1) {
              importedCard.text += text;
            } else {
              importedCard.text += text + "____";
            }
          });
        }

        let cardResponse = await this.apiService.putCard(importedCard).toPromise();
        importedDeck.cards.push(cardResponse.id);
        console.log("CALL OK");
      }

      for (let card of responses) {
        let importedCard: CardPutt =  new CardPutt();
        importedCard.text = "";

        if (card.text.length == 1) {
          importedCard.blanks = 0;
          card.text.forEach(text => {
            importedCard.text += text;
          });

        } else {
          importedCard.blanks = card.text.length - 1;

          card.text.forEach( (text, index) => {
            if (index == 0) {
              importedCard.text += text + "____";
            } else if (index == card.text.length - 1) {
              importedCard.text += text;
            } else {
              importedCard.text += text + "____";
            }
          });
        }
        let cardResponse = await this.apiService.putCard(importedCard).toPromise();
        importedDeck.cards.push(cardResponse.id);
        console.log("RESPONSE OK");
      }    
    }, error => {
      //TODO: handle error
    }).finally(() => {
      this.apiService.putDeck(importedDeck).toPromise().then(deck => {
        this.apiService.getDecks().toPromise().then(decks => {
          this.allDecks = decks['decks'];
          this.searchedDecks = this.allDecks;
          this.deck = deck;
          this.searchedCards = deck.cards;
        });
      })
    })
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
    .toPromise().then(
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
