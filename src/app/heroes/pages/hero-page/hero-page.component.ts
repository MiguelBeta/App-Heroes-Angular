import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.services';
import { ActivatedRoute, Route } from '@angular/router';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private heroService: HeroesService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    ){}


  ngOnInit(): void {
    this.activatedRouter.params
      .pipe(
          switchMap( ({ id }) => this.heroService.getHeroById(id)),
        )
        .subscribe( hero => {

          if ( !hero ) return this.router.navigate([ '/heroes/list' ]);

          this.hero = hero;
          return;
        })
  }

  goBack(): void{
    this.router.navigateByUrl('/heroes/list')
  }

  goBackSearch(): void{
    this.router.navigateByUrl('/heroes/search')
  }

}
