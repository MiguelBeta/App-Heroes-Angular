import { Component } from '@angular/core';
import { AuthService } from '../../../auth/pages/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layou-page',
  templateUrl: './layou-page.component.html',
  styles: ``
})
export class LayouPageComponent {

  public sidebarItems = [
    { label: 'Listado', icon: 'list', url:'./list' },
    { label: 'Añadir', icon: 'add', url:'./new-hero' },
    { label: 'Search', icon: 'search', url:'search' },
]

  constructor (
    private authService: AuthService,
    private router: Router
    ) { }


  get user():User | undefined {
    return this.authService.currentUser;
  }


  //Limpia la informacion en el localStorage
  onLogout(){
    this.authService.logout();
    this.router.navigate(['/auth/login'])
  }

}
