import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { SessionService } from './core/service/session.service';

describe('AppComponent', () => {
  let app: AppComponent;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatToolbarModule,
        AppComponent
      ],
    })
      .compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;

    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
  });

  // Test du retour de l'état initial isLogged à false
  it('should return the initial isLogged state as false', (done) => {
    app.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false); // Valeur initiale
      done();
    });
  });


  // Test de l'appel à logout et navigation vers l'accueil
  it('should call logout and navigate to home', () => {
    // Espionner router.navigate
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Appeler la méthode logout
    app.logout();

    // S'attendre à ce que router.navigate ait été appelé avec un tableau vide (route d'accueil)
    expect(navigateSpy).toHaveBeenCalledWith(['']);

    // Vérifier que l'utilisateur n'est plus connecté
    expect(sessionService.isLogged).toBe(false);
  });
});
