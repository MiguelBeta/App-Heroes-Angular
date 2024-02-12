import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.services';
import { filter, switchMap } from 'rxjs';

import { ConfirmaDialogComponent } from '../../components/confirma-dialog/confirma-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  //Se crea un formulario reactivo con todas las propiedades del
  //objeto que apunta al backend para llenar todos sus campos y tener control sobre ellos
  public heroForm = new FormGroup({
      id: new FormControl<string>(''),
      superhero: new FormControl<string>('', { nonNullable:true }),
      publisher: new FormControl<Publisher>( Publisher.DCComics ),
      alter_ego: new FormControl(''),
      first_appearance: new FormControl(''),
      characters: new FormControl(''),
      alt_img: new FormControl(''),
  })

  constructor (
    private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) {}


  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics'  },
    { id: 'Marvel Comics', desc: 'Marvel - Comics'  },
  ];

  ngOnInit(): void{

    if( !this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
          switchMap( ({ id })  => this.heroService.getHeroById( id )),
        ).subscribe( hero => {
          if( !hero ){
            return this.router.navigateByUrl('/');
          }

          this.heroForm.reset( hero );
          return;
        });

  }

  onSubmit():void{

    if( this.heroForm.invalid ) return;

    if( this.currentHero.id ){
      this.heroService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar(`${hero.superhero} Update!`);
        });
      return;
    }

    this.heroService.addHero( this.currentHero )
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id ]);
        this.showSnackbar(`${hero.superhero} Created!`);
      });
  }

  onDeleteHero(){
    if( !this.currentHero.id ) throw Error('Hero id is requires');

    const dialogRef = this.dialog.open(ConfirmaDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
          filter( (result: boolean) => result ),
          switchMap( () => this.heroService.deleteHeroById(this.currentHero.id)),
          filter( (wasDeleted: boolean) => wasDeleted),
        )
        .subscribe(() => {
          this.router.navigate(['/heroes']);
        })
    // dialogRef.afterClosed().subscribe(result => {
    //   if( !result ) return;

    //   this.heroService.deleteHeroById(this.currentHero.id)
    //     .subscribe( wasDeleted => {
    //       if( wasDeleted )
    //       this.router.navigate(['/heroes']);
    //     });

    // });

  }

  showSnackbar( message: string ): void {
    this.snackBar.open( message, 'done', {
      duration: 2500,
    })
  }

}
