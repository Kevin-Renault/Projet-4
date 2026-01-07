import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { AuthService } from './auth.service';
import { LoginRequest } from '../models/loginRequest.interface';
import { RegisterRequest } from '../models/registerRequest.interface';
import { SessionInformation } from '../models/sessionInformation.interface';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    const mockLoginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
    };

    const mockRegisterRequest: RegisterRequest = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
    };

    const mockSessionInfo: SessionInformation = {
        token: 'mock-token',
        type: 'Bearer',
        id: 1,
        username: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call register and return void on success', () => {
        service.register(mockRegisterRequest).subscribe(() => {
            // Register returns void, so we just check that it completes
            expect(true).toBeTruthy();
        });

        const req = httpMock.expectOne('/api/auth/register');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockRegisterRequest);

        req.flush(null); // Register typically returns no content
    });

    it('should call login and return session information', () => {
        service.login(mockLoginRequest).subscribe((sessionInfo) => {
            expect(sessionInfo).toEqual(mockSessionInfo);
        });

        const req = httpMock.expectOne('/api/auth/login');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockLoginRequest);

        req.flush(mockSessionInfo);
    });
});