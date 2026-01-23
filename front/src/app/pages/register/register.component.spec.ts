import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    const authServiceMock = {
      register: jest.fn(),
      login: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RegisterComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ],
    })
      .overrideComponent(RegisterComponent, {
        set: {
          providers: [
            { provide: AuthService, useValue: authServiceMock }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    mockAuthService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
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
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('email')?.valid).toBe(false);
      expect(component.form.get('email')?.errors).toEqual({ email: true });
    });

    it('should have invalid form when email is empty', () => {
      component.form.setValue({
        email: '',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('email')?.valid).toBe(false);
      expect(component.form.get('email')?.errors).toEqual({ required: true });
    });

    it('should have invalid form when firstName is empty', () => {
      component.form.setValue({
        email: 'test@example.com',
        firstName: '',
        lastName: 'Doe',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('firstName')?.valid).toBe(false);
      expect(component.form.get('firstName')?.errors).toEqual({ required: true });
    });

    it('should have invalid form when firstName is too short', () => {
      component.form.setValue({
        email: 'test@example.com',
        firstName: 'Jo',
        lastName: 'Doe',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('firstName')?.valid).toBe(false);
      expect(component.form.get('firstName')?.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });
    });

    it('should have invalid form when firstName is too long', () => {
      const longName = 'A'.repeat(21); // 21 characters
      component.form.setValue({
        email: 'test@example.com',
        firstName: longName,
        lastName: 'Doe',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('firstName')?.valid).toBe(false);
      expect(component.form.get('firstName')?.errors).toEqual({ maxlength: { requiredLength: 20, actualLength: 21 } });
    });

    it('should have invalid form when lastName is empty', () => {
      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: '',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('lastName')?.valid).toBe(false);
      expect(component.form.get('lastName')?.errors).toEqual({ required: true });
    });

    it('should have invalid form when lastName is too short', () => {
      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Do',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('lastName')?.valid).toBe(false);
      expect(component.form.get('lastName')?.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });
    });

    it('should have invalid form when lastName is too long', () => {
      const longName = 'A'.repeat(21);
      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: longName,
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('lastName')?.valid).toBe(false);
      expect(component.form.get('lastName')?.errors).toEqual({ maxlength: { requiredLength: 20, actualLength: 21 } });
    });

    it('should have invalid form when password is empty', () => {
      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: ''
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('password')?.valid).toBe(false);
      expect(component.form.get('password')?.errors).toEqual({ required: true });
    });

    it('should have invalid form when password is too short', () => {
      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: '12'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('password')?.valid).toBe(false);
      expect(component.form.get('password')?.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });
    });

    it('should have invalid form when password is too long', () => {
      const longPassword = 'A'.repeat(41); // 41 characters
      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: longPassword
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('password')?.valid).toBe(false);
      expect(component.form.get('password')?.errors).toEqual({ maxlength: { requiredLength: 40, actualLength: 41 } });
    });

    it('should have valid form when all fields are correct', () => {
      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });
      expect(component.form.valid).toBe(true);
      expect(component.form.get('email')?.valid).toBe(true);
      expect(component.form.get('firstName')?.valid).toBe(true);
      expect(component.form.get('lastName')?.valid).toBe(true);
      expect(component.form.get('password')?.valid).toBe(true);
    });
  });

  describe('Submit Method', () => {
    it('should register successfully and navigate to login', fakeAsync(() => {
      // Configuration du formulaire avec des données valides
      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });

      // Mock d'inscription réussie
      mockAuthService.register.mockReturnValue(of(undefined));
      const navigateSpy = jest.spyOn(mockRouter, 'navigate').mockResolvedValue(true);

      // Appel de submit
      component.submit();

      // Traitement des opérations asynchrones
      tick();

      // Vérification que authService.register a été appelé avec les bonnes données
      expect(mockAuthService.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });

      // Vérification de la navigation vers /login
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);

      // Vérification que onError est false
      expect(component.onError).toBe(false);
    }));

    it('should handle register error and set onError to true', fakeAsync(() => {
      // Configuration du formulaire avec des données valides
      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });

      // Mock d'erreur d'inscription
      mockAuthService.register.mockReturnValue(throwError(() => new Error('Register failed')));

      // Appel de submit
      component.submit();

      // Traitement des opérations asynchrones
      tick();

      // Vérification que authService.register a été appelé
      expect(mockAuthService.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });

      // Vérification que onError est défini à true
      expect(component.onError).toBe(true);
    }));

  })
});
