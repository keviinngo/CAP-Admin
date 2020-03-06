import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private path = 'https://cap.thebirk.net/'

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

  constructor(private http: HttpClient) { }

  getToken(username: string, password: string): Observable<Token> {
    return this.http.post<Token>(this.path + 'token/', 
    `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`,
    this.tokenHeader
    );
  }

  getDecks(): Observable<Deck[]> {
    return this.http.get<Array<Deck>>(this.path + 'deck/alldecks/',
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

  getCurrentUser(token: string): Observable<User> {
    return this.http.get<User>(this.path + `me/`,
      this.getHeader
    );
  }
}

export class Token {
  access_token: string
  token_type: string
}

export class Deck {
  id: number;
  title: string;
  description: string;
  cards: Array<Card>;
}

export class DeckPutt {
  title: string;
  description: string;
  cards: Array<number>;
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