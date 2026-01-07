import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';
import { AuthService } from 'src/app/core/service/auth.service';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockRouter: jest.Mocked<Router>;

  const mockSessionInfo: SessionInformation = {
    token: 'mock-token',
    type: 'Bearer',
    id: 1,
    username: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false
  };

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn(),
      register: jest.fn()
    };

    const sessionServiceMock = {
      logIn: jest.fn(),
      $isLogged: jest.fn().mockReturnValue(of(false)),
      sessionInformation: null
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock }
      ],
    })
      .overrideComponent(LoginComponent, {
        set: {
          providers: [
            { provide: AuthService, useValue: authServiceMock },
            { provide: SessionService, useValue: sessionServiceMock }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    mockAuthService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    mockSessionService = TestBed.inject(SessionService) as jest.Mocked<SessionService>;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should have invalid form when email is not valid', () => {
      component.form.setValue({
        email: 'invalid-email',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('email')?.valid).toBe(false);
      expect(component.form.get('email')?.errors).toEqual({ email: true });
    });

    it('should have invalid form when email is empty', () => {
      component.form.setValue({
        email: '',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('email')?.valid).toBe(false);
      expect(component.form.get('email')?.errors).toEqual({ required: true });
    });

    it('should have invalid form when password is empty', () => {
      component.form.setValue({
        email: 'test@example.com',
        password: ''
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('password')?.valid).toBe(false);
      expect(component.form.get('password')?.errors).toEqual({ required: true });
    });

    it('should have invalid form when password is too short', () => {
      component.form.setValue({
        email: 'test@example.com',
        password: '12'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('password')?.valid).toBe(false);
      expect(component.form.get('password')?.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });
    });

    it('should have valid form when all fields are correct', () => {
      component.form.setValue({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(component.form.valid).toBe(true);
      expect(component.form.get('email')?.valid).toBe(true);
      expect(component.form.get('password')?.valid).toBe(true);
    });
  });

  it('should login successfully and navigate to sessions', fakeAsync(() => {
    // Configuration du formulaire avec des données valides
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    // Mock de login réussi
    mockAuthService.login.mockReturnValue(of(mockSessionInfo));
    const navigateSpy = jest.spyOn(mockRouter, 'navigate').mockResolvedValue(true);

    // Appel de submit
    component.submit();

    // Traitement des opérations asynchrones
    tick();

    // Vérification que authService.login a été appelé avec les bonnes données
    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });

    // Vérification que sessionService.logIn a été appelé avec la réponse
    expect(mockSessionService.logIn).toHaveBeenCalledWith(mockSessionInfo);

    // Vérification de la navigation vers /sessions
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);

    // Vérification que onError est false
    expect(component.onError).toBe(false);
  }));

  it('should handle login error and set onError to true', fakeAsync(() => {
    // Configuration du formulaire avec des données valides
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    // Mock d'erreur de login
    mockAuthService.login.mockReturnValue(throwError(() => new Error('Login failed')));

    // Appel de submit
    component.submit();

    // Traitement des opérations asynchrones
    tick();

    // Vérification que authService.login a été appelé
    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });

    // Vérification que onError est défini à true
    expect(component.onError).toBe(true);

    // Vérification que logIn et navigate n'ont pas été appelés
    expect(mockSessionService.logIn).not.toHaveBeenCalled();
  }));

});
