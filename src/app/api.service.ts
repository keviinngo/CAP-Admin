import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private path = 'https://cap.thebirk.net/';
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

  putCard(card: CardPutt, token: string): Observable<Card> {
    return this.http.put<Card>(this.path + `card/`,
      card,
      this.putHeader(token)
    );
  }

  putDeck(deck: DeckPutt, token: string): Observable<Deck> {
    return this.http.put<Deck>(this.path + `deck/`,
      deck,
      this.putHeader(token)
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
}

export class Token {
  access_token: string
  token_type: string
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