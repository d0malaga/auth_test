import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Member } from './member';

@Injectable()

export class MemberService {

  private membersUrlFile = 'assets/members2.json';  // URL to web api
  // Fails because webapp served from another server than API
  private membersUrlCORS = 'http://localhost:8080/kitchensink-angularjs/rest/members'
  private membersUrl = 'http://localhost:8080/kitchensink-angularjs/rest/members'

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getMembers(): Observable<Member[]>  {
    return this.http.get<Member[]>(this.membersUrl)
        .pipe(
           tap(_ => this.log('fetched heroes')),
           catchError(this.handleError<Member[]>('getMembers', []))
        );
  }

  /** GET member by id. Will 404 if id not found */
  getMember(id: number): Observable<Member> {
    const url = `${this.membersUrl}/${id}`;
    return this.http.get<Member>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Member>(`getMember id=${id}`))
    );
  }

  /** PUT: update the member on the server */
  updateMember(member: Member): Observable<any> {
    return this.http.put(this.membersUrl, member, this.httpOptions).pipe(
      tap(_ => this.log(`updated member id=${member.id}`)),
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
