

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../pages/services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate {


  constructor(
    private authService: AuthService,
    private router: Router,
    ) { }

  private checkAuthStatus(): boolean | Observable<boolean>{

    return this.authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => console.log('Authenticated:', isAuthenticated ) ),
        tap( isAuthenticated => {
          if ( !isAuthenticated ) {
            this.router.navigate(['./auth/login'])
          }
        }),

      )

  }




  //El guard se encarga de bloquear la pantalla o poner un muro de proteccion para no dejar pasar
  //al usuario de la ruta correspondiente hasta que se logee correctamente


  //Verifica si el usuario esta moviendose durante la app
  canMatch(route: Route, segments: UrlSegment[]):boolean | Observable<boolean> {

    return this.checkAuthStatus();
  }

  //Verfica si la persona esta autenticada y le habilita la siguiente ruta, sino lo redirige a
  //la pag. correspondiente para que se autentique correctamente
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {


    return this.checkAuthStatus();
  }


}
