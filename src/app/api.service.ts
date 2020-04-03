import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private path = 'https://cap.thebirk.net/';
  private cardCastPath = 'https://api.cardcastgame.com/v1/decks/'
  private token = {'token': ''}
  private decks: Deck[];
  private cards: Card[];

  private tokenHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json'
    })
  }

  private putHeader(token: string) {
    return (
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        })
      }
    )
  }

  private getHeader = {
    headers: new HttpHeaders({
      'accept': 'application/json',
    })
  }

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorage
    ) { }

  logInn(username: string, password: string, callback: (data) => void) {
    this.getToken(username, password).subscribe(data => {
      if (data.access_token != null) {
        this.token['token'] = data.access_token;
        this.localStorage.setItem('token', this.token).subscribe(() => {});
        callback(data);
      } else {
        console.error('Invalid username or password')
      }
    });
  }

  getToken(username: string, password: string): Observable<Token> {
    return this.http.post<Token>(this.path + 'token/', 
    `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`,
    this.tokenHeader
    )
  }

  getDecks(): Observable<DeckAll> {
    return this.http.get<DeckAll>(this.path + 'deck/alldecks/',
      this.getHeader
    );
  }

  getDeck(id: number): Observable<Deck> {
    return this.http.get<Deck>(this.path + `deck/${id}`,
      this.getHeader
    );
  }

  getCard(id: number): Observable<Card> {
    return this.http.get<Card>(this.path + `card/${id}`,
      this.getHeader
    );
  }

  putCard(card: CardPutt): Observable<Card> {
    return this.http.put<Card>(this.path + `card/`,
      card,
      this.putHeader(this.token['token'])
    );
  }

  putCardCallback(card: CardPutt, callback: (card: Card) => void): void {
    this.http.post<Card>(this.path + `card/`,
      card,
      this.putHeader(this.token['token'])
    ).subscribe(card => {
      if (card) {
        callback(card);
      }
    });
  }

  putDeck(deck: DeckPutt): Observable<Deck> {
    return this.http.put<Deck>(this.path + `deck/`,
      deck,
      this.putHeader(this.token['token'])
    );
  }

  patchDeckRemoveCard(deckID: number, cardID: number): Observable<Deck> {
    return this.http.patch<Deck>(this.path + `deck/${deckID}/remove/${cardID}`,
      null,
      this.putHeader(this.token['token'])
    );
  }

  patchDeckAddCard(deckID: number, cardID: number): Observable<Deck> {
    return this.http.patch<Deck>(this.path + `deck/${deckID}/add/${cardID}`,
    null,
    this.putHeader(this.token['token'])
    );
  }

  deleteDeck(deckID: number): Observable<Deck> {
    return this.http.delete<Deck>(this.path + `deck/delete/${deckID}`,
    this.putHeader(this.token['token'])    
    );
  }

  getCurrentUser(callback: (data: User) => void) {
    this.localStorage.getItem('token').subscribe(token => {
      this.http.get<User>(this.path + 'me/',
      this.putHeader(token['token'])
      ).subscribe(user => {
        console.log(user);
        if(user != null) {
          callback(user);
        }
      },
        error => {
          console.error('Error')
          callback(null);
        }
      )
    })
  }

  getCardCastDeckInfo(deckID: number): Observable<CardCastInfo> {
    return this.http.get<CardCastInfo>(this.cardCastPath, this.getHeader)
  }

  getCardCastDeckCalls(deckID: number): Observable<CardCastCallCard> {
    return this.http.get<CardCastCallCard>(this.cardCastPath, this.getHeader)
  }

  getCardCastDeckResponses(deckID: number): Observable<CardCastCallCard> {
    return this.http.get<CardCastCallCard>(this.cardCastPath, this.getHeader)
  }
}

export class Token {
  access_token: string
  token_type: string
}

interface CardCastInfo {
  name: string
  code: string
  description: string
  unlisted: boolean
  created_at: Date
  updated_at : Date
  external_copyright: string
  copyright_holder_url: string
  category: string
  call_count: string
  response_count: string
  author: {
    id: string
    username: string
  }
  rating: string
}

interface CardCastCallCard {
  [index: number]: {
    id: string
    text: string[]
    created_at: string
    nsfw: boolean
  }
}

interface iDeck {
  title: string;
  description: string;
 
}

export class Deck implements iDeck {
  id: number;
  title: string;
  description: string;
  cards: Array<Card>;
}

export class DeckPutt implements iDeck {
  title: string;
  description: string;
  cards: Array<number>;
}

export class DeckNoCards implements iDeck {
  title: string;  description: string;
  id: number;
}

export class DeckAll{
  decks: Array<DeckNoCards>;
}

export class Card {
  id: number;
  text: string;
  blanks: number;
}

export class CardPutt {
  text: string;
  blanks: number;
}

export class User {
  username: string;
  disabled: boolean;
}