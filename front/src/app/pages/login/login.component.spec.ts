import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { AuthService } from 'src/app/core/service/auth.service';
import { SessionService } from 'src/app/core/service/session.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

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

    fixture.detectChanges();
  });

  describe('Form Validation', () => {
    // Test required et format email invalide
    it('should have invalid form when email is not valid', () => {
      component.form.setValue({
        email: 'invalid-email',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('email')?.valid).toBe(false);
      expect(component.form.get('email')?.errors).toEqual({ email: true });

      component.form.setValue({
        email: '',
        password: 'password123'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('email')?.valid).toBe(false);
      expect(component.form.get('email')?.errors).toEqual({ required: true });
    });

    // Test required et minlength pour password
    it('should have invalid form when password not valid', () => {
      component.form.setValue({
        email: 'test@example.com',
        password: ''
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('password')?.valid).toBe(false);
      expect(component.form.get('password')?.errors).toEqual({ required: true });

      component.form.setValue({
        email: 'test@example.com',
        password: '12'
      });
      expect(component.form.valid).toBe(false);
      expect(component.form.get('password')?.valid).toBe(false);
      expect(component.form.get('password')?.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });

    });
  });
});
