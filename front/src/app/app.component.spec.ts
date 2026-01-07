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

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should return the initial isLogged state as false', (done) => {
    app.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false); // Valeur initiale
      done();
    });
  });


  it('should call logout and navigate to home', () => {
    // Spy on router.navigate since RouterTestingModule provides a spy, but we need jest spy
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');

    // Call the logout method
    app.logout();

    // Expect sessionService.logOut to have been called
    expect(mockSessionService.logOut).toHaveBeenCalled();

    // Expect router.navigate to have been called with empty array (home route)
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});
