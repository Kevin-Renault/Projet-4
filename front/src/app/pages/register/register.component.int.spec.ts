import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AuthService } from 'src/app/core/service/auth.service';

import { RegisterComponent } from './register.component';

describe('RegisterComponent Integration Tests', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let httpTestingController: HttpTestingController;
    let router: Router;

    const routes = [
        { path: 'login', component: class { } }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes(routes),
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatCardModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                RegisterComponent
            ],
            providers: [
                FormBuilder,
                AuthService
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        httpTestingController = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should handle register error and set onError to true', fakeAsync(() => {
        // Configuration du formulaire avec des données valides
        component.form.setValue({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
        });

        // Appel de submit
        component.submit();

        // Vérification de la requête HTTP
        const req = httpTestingController.expectOne('/api/auth/register');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
        });

        // Simulation d'une erreur
        req.flush(null, { status: 400, statusText: 'Bad Request' });

        // Traitement des opérations asynchrones
        tick();

        // Vérification que onError est défini à true
        expect(component.onError).toBe(true);
    }));

    it('should register successfully and navigate to login', fakeAsync(() => {
        // Configuration du formulaire avec des données valides
        component.form.setValue({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
        });
        // Vérification que le formulaire est valide (couvre le TU)
        expect(component.form.valid).toBe(true);

        const navigateSpy = jest.spyOn(router, 'navigate');

        // Appel de submit
        component.submit();

        // Vérification de la requête HTTP
        const req = httpTestingController.expectOne('/api/auth/register');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
        });

        // Simulation d'un succès
        req.flush(null);

        // Traitement des opérations asynchrones
        tick();

        // Vérification de la navigation vers /login
        expect(navigateSpy).toHaveBeenCalledWith(['/login']);

        // Vérification que onError est false
        expect(component.onError).toBe(false);
    }));
});