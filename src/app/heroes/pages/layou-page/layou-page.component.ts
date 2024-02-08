import { Component } from '@angular/core';

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

}
