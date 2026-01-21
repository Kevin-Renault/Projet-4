import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { TeacherService } from '../../../../core/service/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DetailComponent } from './detail.component';

describe('DetailComponent Integration Tests', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let httpTestingController: HttpTestingController;
  let sessionService: SessionService;

  // Constantes pour les données de test
  const TEST_SESSION_ID = '1';
  const TEST_USER_ID = '1';
  const TEST_TEACHER_ID = '1';

  const TEST_SESSION_NAME = 'Test Session';
  const TEST_SESSION_DESCRIPTION = 'Test description';
  const TEST_SESSION_DATE = new Date('2023-01-01');

  const TEST_TEACHER_FIRST_NAME = 'John';
  const TEST_TEACHER_LAST_NAME = 'Doe';

  // Mock data
  const mockSession = {
    id: 1,
    name: TEST_SESSION_NAME,
    description: TEST_SESSION_DESCRIPTION,
    date: TEST_SESSION_DATE,
    teacher_id: 1,
    users: [2]
  };

  const mockTeacher = {
    id: 1,
    firstName: TEST_TEACHER_FIRST_NAME,
    lastName: TEST_TEACHER_LAST_NAME,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  // Mock HTTP pour simuler les appels API
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: DetailComponent }
        ]),
        MatSnackBarModule,
        ReactiveFormsModule,
        DetailComponent
      ],
      providers: [
        SessionApiService,
        SessionService,
        TeacherService,
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue(TEST_SESSION_ID)
              }
            }
          }
        }
      ]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    sessionService = TestBed.inject(SessionService);

    // Initialise sessionInformation AVANT de créer le composant
    sessionService.sessionInformation = {
      admin: true,
      id: 1,
      username: 'test',
      firstName: 'Test',
      lastName: 'User',
      token: 'token',
      type: 'Bearer'
    };

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;

    // Supprimer les erreurs console de JSDOM pour MatSnackBar
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    if (httpTestingController) {
      httpTestingController.verify();  // Vérifie qu'aucun appel HTTP inattendu n'a eu lieu
    }
    (console.error as jest.Mock).mockRestore();
  });

  it('should load session and teacher data on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();  // Attend la résolution des observables

    // Vérifie les appels HTTP séquentiels
    const sessionReq = httpTestingController.expectOne(`api/session/${TEST_SESSION_ID}`);
    expect(sessionReq.request.method).toBe('GET');
    sessionReq.flush(mockSession);

    tick();  // Attend que la requête teacher soit faite après réception de la session

    const teacherReq = httpTestingController.expectOne(`api/teacher/${TEST_TEACHER_ID}`);
    expect(teacherReq.request.method).toBe('GET');
    teacherReq.flush(mockTeacher);

    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
    expect(component.isParticipate).toBe(false);  // user id 1 n'est pas dans users

    // Simule le clic sur participate
    component.participate();
    tick();

    // Vérifie l'appel HTTP pour participate
    const participateReq = httpTestingController.expectOne(`api/session/${TEST_SESSION_ID}/participate/${TEST_USER_ID}`);
    expect(participateReq.request.method).toBe('POST');
    participateReq.flush({});

    tick();  // Attend le rechargement des données de session

    // Après participate, re-fetch session (utilisateur ajouté)
    const sessionReqAfterParticipate = httpTestingController.expectOne(`api/session/${TEST_SESSION_ID}`);
    expect(sessionReqAfterParticipate.request.method).toBe('GET');
    const mockSessionAfterParticipate = { ...mockSession, users: [2, 1] };  // Utilisateur 1 ajouté
    sessionReqAfterParticipate.flush(mockSessionAfterParticipate);

    tick();  // Attend la requête teacher

    const teacherReqAfterParticipate = httpTestingController.expectOne(`api/teacher/${TEST_TEACHER_ID}`);
    expect(teacherReqAfterParticipate.request.method).toBe('GET');
    teacherReqAfterParticipate.flush(mockTeacher);

    tick();

    // Vérifie que isParticipate est maintenant true
    expect(component.isParticipate).toBe(true);

    // Simule le clic sur unParticipate
    component.unParticipate();
    tick();

    // Vérifie l'appel HTTP pour unParticipate
    const unParticipateReq = httpTestingController.expectOne(`api/session/${TEST_SESSION_ID}/participate/${TEST_USER_ID}`);
    expect(unParticipateReq.request.method).toBe('DELETE');
    unParticipateReq.flush({});

    tick();  // Attend le rechargement des données de session

    // Après unParticipate, re-fetch session (utilisateur retiré)
    const sessionReqAfterUnParticipate = httpTestingController.expectOne(`api/session/${TEST_SESSION_ID}`);
    expect(sessionReqAfterUnParticipate.request.method).toBe('GET');
    const mockSessionAfterUnParticipate = { ...mockSession, users: [2] };  // Utilisateur 1 retiré
    sessionReqAfterUnParticipate.flush(mockSessionAfterUnParticipate);

    tick();  // Attend la requête teacher

    const teacherReqAfterUnParticipate = httpTestingController.expectOne(`api/teacher/${TEST_TEACHER_ID}`);
    expect(teacherReqAfterUnParticipate.request.method).toBe('GET');
    teacherReqAfterUnParticipate.flush(mockTeacher);

    tick();

    // Vérifie que isParticipate est maintenant false
    expect(component.isParticipate).toBe(false);
  }));

  it('should allow admin to delete session', fakeAsync(() => {
    // Simule un admin connecté (sessionInformation déjà initialisé dans beforeEach)
    expect(sessionService.sessionInformation!.admin).toBe(true);

    // Charge initialement la session (comme dans ngOnInit)
    component.ngOnInit();
    tick();

    const sessionReq = httpTestingController.expectOne(`api/session/${TEST_SESSION_ID}`);
    expect(sessionReq.request.method).toBe('GET');
    sessionReq.flush(mockSession);

    tick();

    const teacherReq = httpTestingController.expectOne(`api/teacher/${TEST_TEACHER_ID}`);
    expect(teacherReq.request.method).toBe('GET');
    teacherReq.flush(mockTeacher);

    tick();

    // Vérifie que la session est chargée
    expect(component.session).toEqual(mockSession);

    // Simule la suppression par l'admin
    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.delete();

    // Vérifie l'appel HTTP DELETE
    const deleteReq = httpTestingController.expectOne(`api/session/${TEST_SESSION_ID}`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({});  // Réponse vide pour succès

    tick();

    // Vérifie la navigation vers /sessions après suppression
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  }));

});

