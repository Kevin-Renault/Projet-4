import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { SessionService } from 'src/app/core/service/session.service';
import { UserService } from 'src/app/core/service/user.service';
import { AuthService } from 'src/app/core/service/auth.service';

import { MeComponent } from './me.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { ListComponent } from 'src/app/pages/sessions/components/list/list.component';

describe('MeComponent Integration Tests', () => {
    let component: MeComponent;
    let fixture: ComponentFixture<MeComponent>;
    let httpTestingController: HttpTestingController;
    let router: Router;
    let sessionService: SessionService;
    let userService: UserService;
    let authService: AuthService;
    let navigateSpy: jest.SpyInstance;

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation((message) => {
            if (typeof message === 'string' && !message.includes('Could not parse CSS stylesheet')) {
                console.error(message);
            }
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    const mockUser = {
        id: 1,
        email: 'test@example.com',
        lastName: 'Doe',
        firstName: 'John',
        admin: true,
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockSessionInfo = {
        token: 'mock-token',
        type: 'Bearer',
        id: 1,
        username: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: true
    };

    const routes: Routes = [
        { path: 'login', component: LoginComponent },
        { path: 'sessions', component: ListComponent },
        { path: 'me', component: MeComponent },
        { path: '', redirectTo: '/sessions', pathMatch: 'full' }
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
                MeComponent
            ],
            providers: [
                FormBuilder,
                AuthService,
                SessionService,
                UserService,
                {
                    provide: SessionService,
                    useFactory: () => {
                        const service = new SessionService();
                        service.sessionInformation = mockSessionInfo;
                        return service;
                    }
                },
                { provide: MatSnackBar, useValue: { open: jest.fn() } }
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(MeComponent);
        component = fixture.componentInstance;
        httpTestingController = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);
        sessionService = TestBed.inject(SessionService);
        userService = TestBed.inject(UserService);
        authService = TestBed.inject(AuthService);

        navigateSpy = jest.spyOn(router, 'navigate');

        fixture.detectChanges();
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should login, navigate to me, view user info, and go back', fakeAsync(() => {
        // Simulate login
        authService.login({ email: 'test@example.com', password: 'password' }).subscribe(() => {
            // Navigate to /me
            router.navigate(['/me']);
            tick();

            // Simulate component loading user data
            component.ngOnInit();
            tick();

            // Mock the HTTP call for getById
            const req = httpTestingController.expectOne('api/user/1');
            expect(req.request.method).toBe('GET');
            req.flush(mockUser);

            // Call back
            const backSpy = jest.spyOn(window.history, 'back');
            component.back();
            expect(backSpy).toHaveBeenCalled();
            backSpy.mockRestore();
        });

        // Mock the login HTTP call
        const loginReq = httpTestingController.expectOne('/api/auth/login');
        expect(loginReq.request.method).toBe('POST');
        loginReq.flush(mockSessionInfo);
        tick();
    }));

    it('should login, navigate to me, view user info, and delete account', fakeAsync(() => {
        // Simulate login
        authService.login({ email: 'test@example.com', password: 'password' }).subscribe(() => {
            // Navigate to /me
            router.navigate(['/me']);
            tick();

            // Simulate component loading user data
            component.ngOnInit();
            tick();

            // Mock the HTTP call for getById
            const getReq = httpTestingController.expectOne('api/user/1');
            expect(getReq.request.method).toBe('GET');
            getReq.flush(mockUser);

            // Call delete
            component.delete();
            tick();

            // Mock the delete HTTP call
            const deleteReq = httpTestingController.expectOne('api/user/1');
            expect(deleteReq.request.method).toBe('DELETE');
            deleteReq.flush(mockUser);

            // Verify navigation
            expect(navigateSpy).toHaveBeenCalledWith(['/']);
        });

        // Mock the login HTTP call
        const loginReq = httpTestingController.expectOne('/api/auth/login');
        expect(loginReq.request.method).toBe('POST');
        loginReq.flush(mockSessionInfo);
        tick();
    }));
});