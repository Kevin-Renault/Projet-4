/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { fakeAsync, tick } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { FormComponent } from './form.component';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { SessionService } from '../../../../core/service/session.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

describe('[IT] FormComponent (Integration Test)', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  // Mock data
  const mockTeachers = [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Jane', lastName: 'Smith' }
  ];
  const mockSession = {
    id: 1,
    name: 'Yoga Session',
    description: 'Relaxing yoga',
    date: new Date('2023-01-01'),
    teacher_id: 1
  };

  class MockRouter {
    navigate = jest.fn();
    url = '';
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  // Mock HTTP pour simuler les appels API
        BrowserAnimationsModule,
        ReactiveFormsModule,  // Ajouté pour les formulaires réactifs
        MatCardModule,
        MatIconModule,
        FormComponent,
        MatFormFieldModule,  // Ajouté pour les champs de formulaire
        MatInputModule,      // Ajouté pour les inputs
      ],
      providers: [
        SessionApiService,
        SessionService,
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue(null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Supprimer les erreurs console de JSDOM pour MatSnackBar
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    httpTestingController.verify();  // Vérifie qu'aucun appel HTTP inattendu n'a eu lieu
    (console.error as jest.Mock).mockRestore();
  });

  it('should submit session successfully and navigate to sessions', fakeAsync(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    // Initialise sessionInformation
    (component as any).sessionService.sessionInformation =
      { admin: true, id: 1, username: 'test', firstName: 'Test', lastName: 'User', token: 'token', type: 'Bearer' };
    fixture.detectChanges();  // Déclenche ngOnInit

    const mockTeachers = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' }
    ];
    const mockSession = {
      name: 'Yoga Session',
      description: 'Relaxing yoga',
      date: new Date('2023-01-01'),
      teacher_id: 1
    };

    // Mock le chargement des teachers
    const teacherReq = httpTestingController.expectOne('api/teacher');
    expect(teacherReq.request.method).toBe('GET');
    teacherReq.flush(mockTeachers);

    component.sessionForm!.setValue(mockSession);
    expect(component.sessionForm!.valid).toBe(true); // Vérifie que le formulaire est valide
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Appel de submit
    component.submit();

    const req = httpTestingController.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toMatchObject({
      name: 'Yoga Session',
      description: 'Relaxing yoga',
      teacher_id: 1
    }); // Ignore date


    // Simulation d'un succès
    req.flush(null);

    // Traitement des opérations asynchrones
    tick();

    // Vérification de la navigation vers /sessions
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);

  }));

  it('should update session successfully as admin and navigate to sessions', fakeAsync(() => {
    // Modifier le mock ActivatedRoute pour mode modification
    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.snapshot.paramMap.get = jest.fn().mockReturnValue('1');

    // Modifier le mock Router pour mode update
    Object.defineProperty(router, 'url', { value: '/update', writable: true });

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    // Initialise sessionInformation
    (component as any).sessionService.sessionInformation =
      { admin: true, id: 1, username: 'test', firstName: 'Test', lastName: 'User', token: 'token', type: 'Bearer' };
    fixture.detectChanges();  // Déclenche ngOnInit avec id=1

    // Mock le chargement de la session existante
    const sessionReq = httpTestingController.expectOne('api/session/1');
    expect(sessionReq.request.method).toBe('GET');
    sessionReq.flush(mockSession);

    tick();

    // Vérifie que le formulaire est pré-rempli
    expect(component.sessionForm!.value.name).toBe('Yoga Session');
    expect(component.sessionForm!.value.description).toBe('Relaxing yoga');
    expect(component.sessionForm!.value.teacher_id).toBe(1);

    // Modifie les valeurs
    component.sessionForm!.setValue({
      name: 'Updated Yoga Session',
      description: 'Updated relaxing yoga',
      date: new Date('2023-01-02'),
      teacher_id: 2
    });
    expect(component.sessionForm!.valid).toBe(true);

    const navigateSpy = jest.spyOn(router, 'navigate');

    // Appel de submit pour mise à jour
    component.submit();

    const updateReq = httpTestingController.expectOne('api/session/1');
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body).toMatchObject({
      name: 'Updated Yoga Session',
      description: 'Updated relaxing yoga',
      teacher_id: 2
    });

    // Simulation d'un succès
    updateReq.flush(null);

    // Traitement des opérations asynchrones
    tick();

    // Vérification de la navigation vers /sessions
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  }));
});
