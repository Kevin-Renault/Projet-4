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

  describe('Form Validation', () => {

    // Test required et format email invalide
    it('should have invalid form when email is invalid', () => {
      component.form.setValue({
        email: '',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('email')?.valid).toBe(false);
      expect(component.form.get('email')?.errors).toEqual({ required: true });

      component.form.setValue({
        email: 'invalidmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('email')?.valid).toBe(false);
      expect(component.form.get('email')?.errors).toEqual({ email: true });

    });

    // Test required, minlength, maxlength pour firstName
    it('should have invalid form when firstName is invalid', () => {
      component.form.setValue({
        email: 'test@example.com',
        firstName: '',
        lastName: 'Doe',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('firstName')?.valid).toBe(false);
      expect(component.form.get('firstName')?.errors).toEqual({ required: true });

      component.form.setValue({
        email: 'test@example.com',
        firstName: 'jo',
        lastName: 'Doe',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('firstName')?.valid).toBe(false);
      expect(component.form.get('firstName')?.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });

      const longName = 'A'.repeat(21);
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

    // Test required, minlength, maxlength pour lastName
    it('should have invalid form when lastName is invalid', () => {

      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: '',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('lastName')?.valid).toBe(false);
      expect(component.form.get('lastName')?.errors).toEqual({ required: true });

      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Do',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('lastName')?.valid).toBe(false);
      expect(component.form.get('lastName')?.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });

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

    // Test required, minlength, maxlength pour password
    it('should have invalid form when password is invalid', () => {

      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: ''
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('password')?.valid).toBe(false);
      expect(component.form.get('password')?.errors).toEqual({ required: true });

      component.form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'mp'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('password')?.valid).toBe(false);
      expect(component.form.get('password')?.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });

      const longPassword = 'A'.repeat(41);
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


    // Test formulaire valide
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

});
