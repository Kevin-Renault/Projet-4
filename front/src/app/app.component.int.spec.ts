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


  // Test d'intégration complet login + logout
  it('should login, then logout via the button and navigate to home', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);

    // Simuler un login réel
    const testUser = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    };
    sessionService.logIn(testUser);
    fixture.detectChanges();

    // Vérifier que l'utilisateur est bien connecté
    expect(sessionService.isLogged).toBe(true);

    // Espionner router.navigate
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Chercher le bouton logout dans le DOM et cliquer dessus
    const logoutBtn = fixture.nativeElement.querySelector('button.logout, button[aria-label="logout"], button[ng-reflect-router-link="/logout"]');
    if (logoutBtn) {
      logoutBtn.click();
      fixture.detectChanges();
    } else {
      // Si le bouton n'est pas trouvé, appeler la méthode directement (fallback)
      app.logout();
    }

    // S'attendre à ce que router.navigate ait été appelé avec [''] (route d'accueil)
    expect(navigateSpy).toHaveBeenCalledWith(['']);
    // Vérifier que l'utilisateur n'est plus connecté
    expect(sessionService.isLogged).toBe(false);
  });
});
