import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private path = 'http://127.0.0.1:8000/'

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

  getToken<Observable>(username: string, password: string) {
    return this.http.post<Token>(this.path + 'token/', 
    `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`,
    this.tokenHeader
    );
  }

  getDecks<Observable>() {
    return this.http.get<Array<Deck>>(this.path + 'deck/alldecks/',
      this.getHeader
    );
  }

  getDeck<Observable>(id: number) {
    return this.http.get<Deck>(this.path + `deck/${id}`,
      this.getHeader
    );
  }

  getCard<Observable>(id: number) {
    return this.http.get<Card>(this.path + `card/${id}`,
      this.getHeader
    );
  }

  putCard<Observable>(card: CardPutt, token: string) {
    return this.http.put<Card>(this.path + `card/`,
      card,
      this.putHeader(token)
    );
  }

  putDeck<Observable>(deck: DeckPutt, token: string) {
    return this.http.put<DeckPutt>(this.path + `deck/`,
      deck,
      this.putHeader(token)
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