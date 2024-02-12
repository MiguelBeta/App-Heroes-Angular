import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/enviroments';
import { User } from '../../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})


export class AuthService {

  private baseUrl = environments.baseUrl;
  public user?: User;

  constructor(private http: HttpClient) { }

  get currentUser(): User|undefined {
    if( !this.user ) return undefined;
    //Clona la interfaz User con todas sus propiedades
    return structuredClone( this.user );
  }

  login( email:string, password: string ): Observable<User>{
   return this.http.get<User>(`${ this.baseUrl }/users/1`)
      //.pipe= se utiliza para encadenar lo que llega en un observable
      .pipe(
          //Recibe el usuario que se ingresa en el login y lo almacena en la interfaz use
          tap( user => this.user = user ),
          //Almacena el usuario que llego en el localStorage
          tap( user => localStorage.setItem('token', user.id.toString() )),
        )
  }

  checkAuthentication(): Observable <boolean> {

    if( !localStorage.getItem('token') ) return of (false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => this.user = user ),
        map( user => !!user ),
        catchError( err => of(false) )
      );

  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

}
