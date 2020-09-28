import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LocationStrategy, Location } from '@angular/common';

import { MessageService } from './message.service';
import { Member, NewMember } from './member';
import { environment } from '../environments/environment';

@Injectable()

export class MemberService {

  private membersUrlFile = 'assets/members2.json';  // URL to web api
  // Fails because webapp served from another server than API
  private membersUrlCORS = environment.API_URL + 'members'
  // private membersUrl = location.origin + this.locationStrategy.getBaseHref() + '/rest';
  private membersUrlTry = this.locationStrategy.getBaseHref() + '/rest/members';
  private membersUrl = environment.API_URL + 'members'

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private locationStrategy: LocationStrategy
  ) {}

  /** GET all members */
  getMembers(): Observable<Member[]>  {
    return this.http.get<Member[]>(this.membersUrl)
        .pipe(
           tap(_ => this.log('fetched members from ' + this.membersUrl)),
           catchError(this.handleError<Member[]>('getMembers', []))
        );
  }

  /** GET member by id. Will 404 if id not found */
  getMember(id: number): Observable<Member> {
    const url = `${this.membersUrl}/${id}`;
    return this.http.get<Member>(url).pipe(
      tap(_ => this.log(`fetched member id=${id}`)),
      catchError(this.handleError<Member>(`getMember id=${id}`))
    );
  }

  /** POST: update the member on the server */
  updateMember(member: NewMember): Observable<any> {
    return this.http.post(this.membersUrl, JSON.stringify(member), this.httpOptions).pipe(
      tap(_ => this.log(`Added member: ${member.name}`)),
      catchError(this.handleError<any>('updateMember'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  
  /** Log a MemberService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`MemberService: ${message}`);
  }

}
