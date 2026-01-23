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

import { LoginComponent } from './login.component';
import { ListComponent } from '../sessions/components/list/list.component';

describe('LoginComponent Integration Tests', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let httpTestingController: HttpTestingController;
    let router: Router;

    const routes = [
        { path: 'login', component: class { } },
        { path: 'sessions', component: ListComponent }
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
                LoginComponent
            ],
            providers: [
                FormBuilder,
                AuthService
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
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
            password: 'password123'
        });

        // Appel de submit
        component.submit();

        // Vérification de la requête HTTP
        const req = httpTestingController.expectOne('/api/auth/login');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
            email: 'test@example.com',
            password: 'password123'
        });

        // Simulation d'une erreur
        req.flush(null, { status: 400, statusText: 'Bad Request' });

        // Traitement des opérations asynchrones
        tick();

        // Vérification que onError est défini à true
        expect(component.onError).toBe(true);
    }));

    it('should login successfully and navigate to /sessions', fakeAsync(() => {
        // Configuration du formulaire avec des données valides
        component.form.setValue({
            email: 'test@example.com',
            password: 'password123'
        });
        // Vérification que le formulaire est valide (couvre le TU)
        expect(component.form.valid).toBe(true);

        const navigateSpy = jest.spyOn(router, 'navigate');

        // Appel de submit
        component.submit();

        // Vérification de la requête HTTP
        const req = httpTestingController.expectOne('/api/auth/login');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
            email: 'test@example.com',
            password: 'password123'
        });

        // Simulation d'un succès
        req.flush(null);

        // Traitement des opérations asynchrones
        tick();

        // Vérification de la navigation vers /sessions
        expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);

        // Vérification que onError est false
        expect(component.onError).toBe(false);
    }));
});