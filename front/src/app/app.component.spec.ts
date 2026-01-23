import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { SessionService } from './core/service/session.service';

describe('AppComponent', () => {
  let app: AppComponent;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    const sessionServiceMock = {
      $isLogged: jest.fn().mockReturnValue(of(false)),
      logOut: jest.fn(),
      sessionInformation: null
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatToolbarModule,
        AppComponent
      ],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock }
      ],
    })
      .overrideComponent(AppComponent, {
        set: {
          providers: [
            { provide: SessionService, useValue: sessionServiceMock }
          ]
        }
      })
      .compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;

    mockSessionService = TestBed.inject(SessionService) as jest.Mocked<SessionService>;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  // Test de la création de l'app
  it('should create the app', () => {
    expect(app).toBeTruthy();
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
    // Espionner router.navigate car RouterTestingModule fournit un espion, mais nous avons besoin d'un espion jest
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');

    // Appeler la méthode logout
    app.logout();

    // S'attendre à ce que sessionService.logOut ait été appelé
    expect(mockSessionService.logOut).toHaveBeenCalled();

    // S'attendre à ce que router.navigate ait été appelé avec un tableau vide (route d'accueil)
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});
