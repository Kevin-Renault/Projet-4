/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { fakeAsync, tick } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { ListComponent } from './list.component';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { SessionService } from '../../../../core/service/session.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { LoginComponent } from '../../../login/login.component';
import { Router } from '@angular/router';

describe('[IT] ListComponent (Integration Test)', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  // Mock HTTP pour simuler les appels API
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: ListComponent }
        ]),
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        ListComponent,
        LoginComponent
      ],
      providers: [
        SessionApiService,
        SessionService,
        AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    // Initialise sessionInformation pour éviter erreurs template
    (component as any).sessionService.sessionInformation =
      { admin: true, id: 1, username: 'test', firstName: 'Test', lastName: 'User', token: 'token', type: 'Bearer' };
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();  // Vérifie qu'aucun appel HTTP inattendu n'a eu lieu
  });

  it('should load and display sessions from the real SessionApiService', fakeAsync(() => {
    const mockSessions = [
      { id: 1, name: 'Yoga Session', description: 'Relaxing yoga', date: new Date(), teacher_id: 1, users: [] },
      { id: 2, name: 'Pilates Session', description: 'Core workout', date: new Date(), teacher_id: 2, users: [] }
    ];

    // Subscribe à l'observable
    component.sessions$.subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
    });

    // Simule la réponse HTTP
    const req = httpTestingController.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions, { status: 200, statusText: 'OK' });

    // Traite les opérations asynchrones
    tick();

    // Vérifie que le getter user retourne les infos de session
    expect(component.user).toEqual({
      admin: true,
      id: 1,
      username: 'test',
      firstName: 'Test',
      lastName: 'User',
      token: 'token',
      type: 'Bearer'
    });
  }));
});